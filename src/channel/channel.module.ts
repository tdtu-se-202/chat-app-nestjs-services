import { Module } from "@nestjs/common";
import { MessageModule } from "src/message/message.module";
import { ChannelController } from "./channel.controller";
import { ChannelGateway } from "./channel.gateway";
import { ChannelProvider } from "./channel.provider";
import { ChannelService } from "./channel.service";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [MessageModule, UserModule, AuthModule],
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway, ...ChannelProvider],
  exports: [ChannelService],
})
export class ChannelModule {}
