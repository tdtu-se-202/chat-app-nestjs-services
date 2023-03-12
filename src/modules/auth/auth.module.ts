import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/users.entity';
import { SessionSerializer } from './utils/serializer';
import { AuthEntity } from './entities/auth.entity';

@Module({
  imports: [UsersModule, PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, AuthEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionSerializer],
})
export class AuthModule {
}
