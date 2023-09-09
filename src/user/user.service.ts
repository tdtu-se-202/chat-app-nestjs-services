import { Injectable, BadRequestException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";
import sequelize, { Op } from "sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./user.entity";
import { FriendRequestService } from "src/friend/services/friend-request.service";
import { FriendRequestEnum } from "src/friend/enums/friend-request.enum";
import { CreateFriendRequestDto } from "src/friend/dtos/create-friend-request.dto";
import { UpdateFriendRequestDto } from "src/friend/dtos/update-friend-request.dto";
import { FriendRequest } from "src/friend/entities/friend-requests.entity";
import { Friend } from "src/friend/entities/friends.entity";
import { isEnum } from "class-validator";
import { FriendService } from "src/friend/services/friend.service";
import { CreateFriendDto } from "src/friend/dtos/create-friend.dto";

@Injectable()
export class UserService {
  constructor(
    private readonly friendRequestService: FriendRequestService,
    private readonly friendService: FriendService
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return await User.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    return await User.findByPk(id, {
      include: [
        {
          association: User.associations.friendInfors
        }
      ],
      attributes: { exclude: ["password"] },
    });
  }

  async findBySearch(search: string): Promise<any> {
    return await User.findAll({
      where: { username: { [Op.iLike]: `%${search}%` } },
    });
  }

  async createUser({ email, username, password }: CreateUserDto): Promise<any> {
    try {
      return await User.create({
        email,
        username,
        password,
      });
    } catch (e) {
      return e
    }
  }

  async updateUser(user: any): Promise<any> {
    try {
      return await User.update(user, { where: { id: user.id } });
    } catch {
      return {
        statusCode: "409",
        message: "This username is already in use.",
      };
    }
  }

  async getFriends({ id }) {
    try {
      const friends: User[] = [];

      const friendIds = (await User.findByPk(id)).friends;

      for (let i = 0; i < friendIds.length; i++) {
        const user = await User.findByPk(friendIds[i]);
        friends.push(user);
      }

      const friendList = (await User.findByPk(id, {
        include: [{
          association: User.associations.friendInfors,
          attributes: {
            exclude: ['password']
          }
        }]
      })).friendInfors

      return {
        statusCode: "200",
        friends: friendList,
        //friendtest: friendList
      };
    } catch (error) {
      console.log(error)
      return {
        statusCode: "404",
        message: "Friends not found.",
      };
    }
  }

  async setFriend({ id, otherId, status }) {
    const firstUser = await this.findById(id);
    const secondUser = await this.findById(otherId);

    // Check if user exists
    if (!firstUser || !secondUser)
      throw new NotFoundException("User not found.");

    // Check if user is blocked
    if (
      (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
      (secondUser.blocked && secondUser.blocked.includes(id))
    )
      return {
        status: "406",
        message: "You cannot do this. You are blocked.",
      };

    // Check if users are friends
    if (status && firstUser.friends && firstUser.friends.includes(otherId))
      return {
        statusCode: "409",
        message: "You are already friend.",
      };

    if (status) {
      this.setRequest({ id: otherId, otherId: id, status: FriendRequestEnum.FriendAccepted });

      User.update(
        {
          friends: sequelize.fn(
            "array_append",
            sequelize.col("friends"),
            otherId
          ),
        },
        { where: { id } }
      );
      User.update(
        { friends: sequelize.fn("array_append", sequelize.col("friends"), id) },
        { where: { id: otherId } }
      );
      
      let createFriendDto: CreateFriendDto = {
        userId: firstUser.id,
        friendId: secondUser.id
      }

      try {
        let result = await this.friendService.makeFriends(createFriendDto)  
        if (result instanceof Error) {
          return {
            statusCode: "400",
            message: result.message
          }
        } 
      } catch (error) {
        return {
          statusCode: "400",
          message: error
        }
      }

    } else {
      User.update(
        {
          friends: sequelize.fn(
            "array_remove",
            sequelize.col("friends"),
            otherId
          ),
        },
        { where: { id } }
      );
      User.update(
        { friends: sequelize.fn("array_remove", sequelize.col("friends"), id) },
        { where: { id: otherId } }
      );

      try {
        let result = await this.friendService.deleteFriends(firstUser.id, secondUser.id)
        if (result.statusCode !== "200") {
          return {
            statusCode: "400",
            message: "Error when delete friend"
          }
        } 
      } catch (error) {
        return {
          statusCode: "400",
          message: error.message
        }
      }
    }

    return {
      statusCode: "200",
      message: "User updated successfully.",
    };
  }

  async getRequests({ id }) {
    try {
      const requests: User[] = [];
      const requestIds = (await User.findByPk(id)).requests;

      for (let i = 0; i < requestIds.length; i++) {
        const user = await User.findByPk(requestIds[i]);
        requests.push(user);
      }

      const requestsList = (await User.findByPk(id, {
        include: [{
          association: User.associations.friendRequestFromUsers,
          through: { 
            where: {
              friendStatus: FriendRequestEnum.FriendRequested
            }
          },
          attributes: {
            exclude: ['password']
          }
        }]
      })).friendRequestFromUsers

      return {
        statusCode: "200",
        //requests: requests,
        requests: requestsList
      };
    } catch (e) {
      console.log(e)
      return {
        statusCode: "404",
        message: "Requests not found.",
      };
    }
  }

  async setRequest({ id, otherId, status }) {
    const firstUser = await this.findById(id);
    const secondUser = await this.findById(otherId);

    let isValidFriendRequestStatus = isEnum(status, FriendRequestEnum)
    if (!(isValidFriendRequestStatus)) {
         return {
           statusCode: "404",
           message: "friend request status is not valid!",
        }
    }

    // Check if user exists
    if (!firstUser || !secondUser)
      throw new NotFoundException("User not found.");

    // Check if user is blocked
    if (
      (firstUser.blocked && firstUser.blocked.includes(otherId)) ||
      (secondUser.blocked && secondUser.blocked.includes(id))
    )
      return {
        status: "406",
        message: "You cannot do this. You are blocked.",
      };

    // Check if users are friends
    if (status === FriendRequestEnum.FriendRequested && secondUser.friends && secondUser.friends.includes(id))
      return {
        statusCode: "406",
        message: "You are already friends.",
      };
    if (status === FriendRequestEnum.FriendRequested && secondUser.requests && secondUser.requests.includes(id))
      return {
        statusCode: "409",
        message: "You already sent a request to this user.",
      };

    if (status === FriendRequestEnum.FriendRequested) {
      User.update(
        {
          requests: sequelize.fn("array_append", sequelize.col("requests"), id),
        },
        { where: { id: otherId } }
      );

      let createFriendRequestDto: CreateFriendRequestDto = {
        userId: id,
        friendId: secondUser.id,
        friendStatus: FriendRequestEnum.FriendRequested
      }
      
      try {
        let result = await this.friendRequestService.createOne(createFriendRequestDto)
        if (!(result instanceof FriendRequest)) 
        return {
          statusCode: result.statusCode,
          message: result.message
        }

      } catch (error) {
        return error
      }

    } else {
      User.update(
        {
          requests: sequelize.fn("array_remove", sequelize.col("requests"), id),
        },
        { where: { id: otherId } }
      );
      
  
      let updateFriendRequestDto = {
        userId: secondUser.id,
        friendId: id,
        friendStatus: status
      }
      if (status === false) {
        updateFriendRequestDto.friendStatus = FriendRequestEnum.FriendRemoved
      }

      const frqToUpdate = await this.friendRequestService.findOneByConditions({userId: secondUser.id, friendId: id})
      
      if (frqToUpdate) {
        await this.friendRequestService.updateOne(frqToUpdate.id, updateFriendRequestDto)
      }
    }

    return {
      statusCode: "200",
      message: "User updated successfully.",
    };
  }

  async getBlocked({ id }) {
    try {
      const blocked: User[] = [];
      const blockedIds = (await User.findByPk(id)).blocked;

      for (let i = 0; i < blockedIds.length; i++) {
        const user = await User.findByPk(blockedIds[i]);
        blocked.push(user);
      }

      return {
        statusCode: "200",
        blocked,
      };
    } catch {
      return {
        statusCode: "404",
        message: "Blocked not found.",
      };
    }
  }

  async setBlocked({ id, otherId, status }) {
    const firstUser = await this.findById(id);
    const secondUser = await this.findById(otherId);

    // Check if user exists
    if (!firstUser || !secondUser)
      throw new NotFoundException("User not found.");

    // Check if user is blocked
    if (status && firstUser.blocked && firstUser.blocked.includes(otherId))
      return {
        statusCode: "409",
        message: "This user has already been blocked.",
      };

    this.setRequest({ id, otherId, status: false });

    if (status) {
      await this.setFriend({ id, otherId, status: false });
      await this.setRequest({ id, otherId, status: false });

      User.update(
        {
          blocked: sequelize.fn(
            "array_append",
            sequelize.col("blocked"),
            otherId
          ),
        },
        {
          where: { id },
        }
      );
    } else {
      User.update(
        {
          blocked: sequelize.fn(
            "array_remove",
            sequelize.col("blocked"),
            otherId
          ),
        },
        {
          where: { id },
        }
      );
    }

    return {
      statusCode: "200",
      message: "User updated successfully.",
    };
  }
}
