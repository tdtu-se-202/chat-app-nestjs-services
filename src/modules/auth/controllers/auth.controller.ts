import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.service";
import { CreateUserDto } from "../../users/dtos/create-user.dto";
import { AccessTokenGuard } from "../guards/access-token.guard";
import { RefreshTokenGuard } from "../guards/refresh-token.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@Controller('auth')
@ApiBearerAuth()
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: AuthDto) {
    return this.authService.signIn(data);
  }

  @Get('logout')
  @UseGuards(AccessTokenGuard)
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
