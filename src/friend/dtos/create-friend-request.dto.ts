import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFriendRequestDto {
  
  @IsNotEmpty()
  readonly userId!: string;

  @IsNotEmpty()
  readonly friendId!: string;

  @IsNotEmpty()
  readonly friendStatus!: string;
}
