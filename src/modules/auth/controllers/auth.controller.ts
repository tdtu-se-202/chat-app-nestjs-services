import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { FacebookAuthGuard } from '../guards/facebook-auth.guard';
import { RefreshTokenGuard } from '../guards/rt.guard';
import { Public } from '../decorators/public.decorator';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({
    description: 'Login successful',
  })
  @ApiForbiddenResponse({
    description: `Forbidden. Cannot login`,
  })
  @Post('login')
  @Public()
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @Public()
  refreshTokens(userId: string, refreshToken: string) {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Create new user' })
  @ApiCreatedResponse({
    description: 'Create a use',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiForbiddenResponse({
    description: `Forbidden. Cannot create new user`,
  })
  @Post('create')
  @Public()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Google Login' })
  @ApiCreatedResponse({
    description: 'Login with google successful',
  })
  @ApiForbiddenResponse({
    description: `Forbidden. Login with google fail`,
  })
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  @Public()
  handleGoogleRedirect() {
    return { msg: 'OK' };
  }

  @ApiOperation({ summary: 'Facebook login' })
  @ApiCreatedResponse({
    description: 'Login with facebook successful',
  })
  @ApiForbiddenResponse({
    description: `Forbidden. Login with facebook fail`,
  })
  @Get('facebook/login')
  @Public()
  @UseGuards(FacebookAuthGuard)
  handleFacebookLogin() {
    return { msg: 'Facebook Authentication' };
  }

  @Get('facebook/redirect')
  @UseGuards(FacebookAuthGuard)
  @Public()
  handleFacebookRedirect() {
    return { msg: 'OK' };
  }
}
