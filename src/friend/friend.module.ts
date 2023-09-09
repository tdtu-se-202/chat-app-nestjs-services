import { Module } from '@nestjs/common';
import { FriendService } from './services/friend.service';
import { FriendController } from './controllers/friend.controller';
import { DatabaseModule } from 'src/database/database.module';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';

@Module({
  imports: [DatabaseModule],
  controllers: [FriendController, FriendRequestController],
  providers: [FriendService, FriendRequestService],
  exports: [FriendService, FriendRequestService],
})
export class FriendModule {}
