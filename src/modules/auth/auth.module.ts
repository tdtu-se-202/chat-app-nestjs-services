import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.register({}),
    ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {
}
