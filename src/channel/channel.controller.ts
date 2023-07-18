import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Delete, Put } from "@nestjs/common/decorators";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelService } from "./channel.service";
import { ChannelDto } from "./dto/create-channel-dto";

@Controller("channels")
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get(":id")
  async getChannel(@Param("id") id: string) {
    return await this.channelService.getChannel(id);
  }

  @Get("user/:userId")
  async getChannelByUserId(@Param("userId") userId: string) {
    return await this.channelService.getChannelsByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("")
  async createChannel(@Body() body: ChannelDto) {
    return await this.channelService.createChannel(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateChannel(@Param("id") id: string, @Body() body) {
    return await this.channelService.updateChannel({
      id,
      channel: body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteChannel(@Param("id") id: string) {
    return await this.channelService.deleteChannel(id);
  }
}
