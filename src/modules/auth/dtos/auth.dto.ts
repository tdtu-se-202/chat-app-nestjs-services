import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthDto {
  @ApiProperty({
    description: 'User email for account registration',
    example: 'sample_email@sample.com',
    type: String,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password',
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  password: string;
}
