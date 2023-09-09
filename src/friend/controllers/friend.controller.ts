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

@Controller('friends')
export class FriendController {
  constructor(
    private readonly friendsService: FriendService
    ) {}

  @Post('/admin')
  test() {
    return true;
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createFriend(@Body() createFriendDto: CreateFriendDto) {
    return await this.friendsService.createOne(createFriendDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() filters: any) {
    return await this.friendsService.findByFilters(filters);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getFriend(@Param('id') id: string) {
    return this.friendsService.findOne(id);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateFriend(@Param('id') id: string, @Body() dto: UpdateFriendDto) {
    return this.friendsService.updateOne(id, dto);
  }
}
