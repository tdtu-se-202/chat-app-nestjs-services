import { IsNotEmpty } from 'class-validator';

export class UpdateFriendRequestDto {
  @IsNotEmpty()
  readonly userId!: string;

  @IsNotEmpty()
  readonly friendId!: string;

  @IsNotEmpty()
  readonly friendStatus!: string;
}
