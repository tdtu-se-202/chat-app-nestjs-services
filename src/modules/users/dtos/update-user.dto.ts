import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'sample_email@sample.com',
    description: 'Required - email',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: false,
    example: 'Kienn Thiett',
    description: `Optional - User's full name`,
  })
  @IsNotEmpty()
  @IsOptional()
  readonly displayName?: string;

  @ApiProperty({
    description: `Address`,
    required: false,
    example: 'Viet Nam',
  })
  @IsNotEmpty()
  @IsOptional()
  readonly address?: string;

  @ApiProperty({
    description: `Avatar URL`,
    required: false,
    example: 'http://localhost:5000/api/',
  })
  @IsNotEmpty()
  @IsOptional()
  readonly avatarUrl?: string;

  @ApiProperty({
    description: `Phone number`,
    required: false,
    example: '+84798624951',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  @Matches(/^(\+?)\(?\d{0,3}\)?\d{4,20}$/, {
    message: 'Invalid phone number',
  })
  readonly phoneNumber?: string;
}
