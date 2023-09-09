import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest } from '../entities/friend-requests.entity';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { CreateFriendRequestDto } from "../dtos/create-friend-request.dto";
import { Op } from 'sequelize';

@Injectable()
export class FriendRequestService {

  async findByFilters(filters: any): Promise<any> {
    return await FriendRequest.findAll({
      where: filters, 
      include: [
        FriendRequest.associations.fromUser,
        FriendRequest.associations.toUser,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }

  async findOneByConditions(conditons: {}): Promise<FriendRequest | undefined | null> {
    return FriendRequest.findOne({where: {...conditons},
      include: [
        FriendRequest.associations.fromUser,
        FriendRequest.associations.toUser,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }
  
  async findOne(id: string) {
    return await FriendRequest.findOne({ where: {id}, 
      include: [
        FriendRequest.associations.fromUser,
        FriendRequest.associations.toUser,
      ],
      attributes: { exclude: ["userId", "friendId"] },
    });
  }

  async updateOne(id: string, dto: UpdateFriendRequestDto) {
    const friendRequest = await FriendRequest.findOne({where: { id }});
    if (!friendRequest) {
      throw new NotFoundException('friend Request dose not exist!');
    }
    try {
      Object.assign(friendRequest, dto); // Assign properties
      return await friendRequest.save();
    } catch(e) {
      return {
        statusCode: "409",
        message: "Error when update friend: " + e 
      }
    }
  }

  async createOne(dto: CreateFriendRequestDto) {
    // let findFriendConditions = {
    //   userId: dto.userId, 
    //   friendId: dto.friendId,
    //   friendStatus: dto.friendStatus,
    // }

    let findFriendConditions = {
      [Op.or]: [
        {
          userId: dto.userId, 
          friendId: dto.friendId,
        }, 
        {
          userId: dto.friendId, 
          friendId: dto.userId,
        }
      ]
    };
    const isExist = await this.findOneByConditions(findFriendConditions);
    
    if (isExist) {
      return {
        statusCode: "400",
        message: "This friend relationship is already exist"
      }
    }

    const userInstance = FriendRequest.build({...dto});
    try {
      return await userInstance.save();
    } catch (error) {
      console.log(error.original.detail)
      return {
        statusCode: "400",
        message: error.original.detail
      }
    }
  }
}
