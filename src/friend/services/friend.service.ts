import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { Friend } from '../entities/friends.entity';
import { UpdateFriendDto } from '../dtos/update-friend.dto';
import { CreateFriendDto } from "../dtos/create-friend.dto";
import { FriendRequest } from '../entities/friend-requests.entity';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { User } from 'src/user/user.entity';
import { FriendRequestEnum } from '../enums/friend-request.enum';
import { Op } from 'sequelize';

@Injectable()
export class FriendService {
  async findByFilters(filters: any): Promise<any> {
    return await Friend.findAll({
      where: filters, 
      include: [
        Friend.associations.user,
        Friend.associations.friendInfo,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }

  async findOneByConditions(conditons: {}): Promise<Friend | undefined | null> {
    return Friend.findOne({where: {...conditons},
      include: [
        Friend.associations.user,
        Friend.associations.friendInfo,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }

  async findOne(id: string) {
    return await Friend.findOne({ where: {id}, 
      include: [
        Friend.associations.user,
        Friend.associations.friendInfo,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }

  async updateOne(id: string, dto: UpdateFriendDto) {
    const user = await Friend.findOne({ where: {id} });
    if (!user) {
      throw new BadRequestException('Friend dose not exist!');
    }
    try {
      return await Friend.update({...dto},
        {
          where: {id}
        }
      );
    } catch (e) {
      return {
        statusCode: "409",
        message: "Error when update friend: " + e 
      }
    }
  }

  async createOne(dto: CreateFriendDto) {
    let findFriendConditions = {
      userId: dto.userId,
      friendId: dto.friendId
    }
    const isExist = await this.findOneByConditions(findFriendConditions);

    if (isExist) {
      throw new BadRequestException('This friend relationship is already exist');
    }

    return await Friend.create({...dto});
  }

  async makeFriends(dto: CreateFriendDto) {
    
    let createFriendOneDto: CreateFriendDto = {userId: dto.userId, friendId: dto.friendId}
    let createFriendTwoDto: CreateFriendDto = {userId: dto.friendId, friendId: dto.userId}  
    
    try {
      const newCreatedFriendOne = await Friend.create({...createFriendOneDto})
      const newCreatedFriendTwo = await Friend.create({...createFriendTwoDto})   
      return {friendOneId: newCreatedFriendOne.id, friendTwoId: newCreatedFriendTwo.id}
    } catch (error) {
      console.log("Create friend error:" + error.name)
      return error
    }
  }

  async deleteFriends(firstUserId, secondUserId) {
    try {
      await FriendRequest.destroy({
        where: {
          [Op.or]: [
            {
              userId: firstUserId,
              friendId: secondUserId,
            },
            {
              userId: secondUserId,
              friendId: firstUserId,
            }
          ]
        }
      })

      await Friend.destroy({
        where: {
          userId: firstUserId,
          friendId: secondUserId,
        }
      })
  
      await Friend.destroy({
        where: {
          userId: secondUserId,
          friendId: firstUserId,
        }
      })

      return {
        statusCode: "200",
        message: "Friend updated successfully"
      }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
