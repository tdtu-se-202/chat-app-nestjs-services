import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserProviders } from "./user.providers";
import { DatabaseModule } from "../database/database.module";
import { UserController } from "./user.controller";
import { FriendModule } from "src/friend/friend.module";

@Module({
  imports: [DatabaseModule, FriendModule],
  controllers: [UserController],
  providers: [UserService, ...UserProviders],
  exports: [UserService],
})
export class UserModule {}
