import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email for account registration',
    example: 'sample_email@sample.com',
    type: String,
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    type: String,
    description: `User's full name`,
    example: 'Kien Thiet Hoang',
  })
  @IsOptional()
  displayName?: string;
}
