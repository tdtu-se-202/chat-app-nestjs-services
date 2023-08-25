import { IsNotEmpty } from 'class-validator';

export class UpdateFriendDto {
  @IsNotEmpty()
  readonly userId!: string;

  @IsNotEmpty()
  readonly friendId!: string;
}
