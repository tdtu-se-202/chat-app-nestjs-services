import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthModule } from "./auth/auth.module";
import { ChannelModule } from "./channel/channel.module";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { FriendModule } from "./friend/friend.module";

@Module({
  imports: [
    AuthModule,
    UserModule,
    ChannelModule,
    MessageModule,
    FriendModule,
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
