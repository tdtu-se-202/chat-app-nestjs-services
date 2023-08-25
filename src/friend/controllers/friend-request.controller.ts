import {
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Body,
  Put,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { UpdateFriendDto } from '../dtos/update-friend.dto';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateFriendDto } from '../dtos/create-friend.dto';
import { FriendRequestService } from '../services/friend-request.service';
import { CreateFriendRequestDto } from '../dtos/create-friend-request.dto';
import { UpdateFriendRequestDto } from '../dtos/update-friend-request.dto';
import { FriendRequestEnum } from '../enums/friend-request.enum';
import { isEnum } from 'class-validator';

@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestController {
  constructor(
    private readonly friendRequestService: FriendRequestService,
    private readonly friendService: FriendService,
  ) { }

  @Post('/admin')
  @UseGuards(JwtAuthGuard)
  test() {
    return true;
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createFriendRequest(@Body() createFriendRequestDto: CreateFriendRequestDto) {
    let isValidFriendRequestStatus = isEnum(createFriendRequestDto.friendStatus, FriendRequestEnum)
    if (!(isValidFriendRequestStatus) || createFriendRequestDto.friendStatus !== FriendRequestEnum.FriendRequested) {
      throw new BadRequestException('friend request status is invalid!');
    }

    return await this.friendRequestService.createOne(createFriendRequestDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() filters: any) {
    const friends = await this.friendRequestService.findByFilters(filters);
    return { friends }
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getFriend(@Param('id') id: string) {
    return this.friendRequestService.findOne(id);
  }

//   @Put('/:id')
//   @UseGuards(JwtAuthGuard)
//   async updateFriend(@Param('id') id: string, @Body() dto: UpdateFriendRequestDto) {
//     let isValidFriendRequestStatus = isEnum(dto.friendStatus, FriendRequestEnum)
//     if (!(isValidFriendRequestStatus)) {
//       throw new BadRequestException('friend request status is invalid!');
//     }
//     if (dto.friendStatus === FriendRequestEnum.FriendAccepted) {
//       return await this.friendService.makeFriends(dto)
//     }
//     return await this.friendRequestService.updateOne(id, dto);
//   }
}
