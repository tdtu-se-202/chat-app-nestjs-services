import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { MessageService } from "./message.service";

@Controller("messages")
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getMessage(@Param("id") id: string) {
    return await this.messageService.getMessage({ id });
  }

  @Get("channel/:id")
  async getMessagesByChannel(@Param("id") id: string) {
    return await this.messageService.getMessagesByChannel({ id });
  }

  @Post("")
  async createMessage(@Body() body) {
    return await this.messageService.addMessage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateMessage(@Param("id") id: string, @Body() body) {
    return await this.messageService.updateMessage({
      id,
      message: body,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteMessage(@Param("id") id: string) {
    return await this.messageService.deleteMessage({ id });
  }
}
