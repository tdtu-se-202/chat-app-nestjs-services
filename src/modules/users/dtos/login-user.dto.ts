import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'sample_email@sample.com',
    type: String,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password',
    example: 'P@ssw0rd',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
