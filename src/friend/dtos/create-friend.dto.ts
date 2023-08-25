import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFriendDto {
  
  @IsNotEmpty()
  readonly userId!: string;

  @IsNotEmpty()
  readonly friendId!: string;
}
