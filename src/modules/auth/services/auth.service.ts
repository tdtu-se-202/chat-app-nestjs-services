import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users.service';
import { LoginUserDto } from '../../users/dtos/login-user.dto';
import { AuthHelper } from '../helpers/auth.helper';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { UserEntity } from '../../users/entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtConstants } from '../constants/jwt';
import { AuthEntity } from '../entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private config: ConfigService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
  ) {}

  async validateUser(email: string, displayName: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    return user
      ? user
      : this.createUser({
          email: email,
          password: `${email}_${displayName}`,
          displayName: displayName,
        });
  }

  async createUser(dto: CreateUserDto) {
    const isExist = await this.usersService.findOneByEmail(dto.email);

    if (isExist) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await AuthHelper.hashPassword(dto.password);

    const userInstance = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepository.save(userInstance);
  }

  async login(dto: LoginUserDto) {
    const payload = { email: dto.email };
    const user = await this.usersService.findOneByEmail(dto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await AuthHelper.isValidPassword(dto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid information');
    }

    return await this.getTokens(payload);
  }

  async refreshTokens(userId: string, rt: string) {
    const userAuth = await this.getUserAuth(userId);
    if (!userAuth || !userAuth.id) throw new ForbiddenException('Access Denied');

    if (userAuth.refreshToken !== rt) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userAuth.user.email);

    await this.updateAuth({ ...userAuth, accessToken: tokens.access_token });

    return tokens;
  }

  async getUserAuth(userId: string) {
    const auth = this.authRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
    return auth;
  }

  async getTokens(payload: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '7h',
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.rtSecret,
        expiresIn: '24h',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateAuth(auth: any) {
    return await this.authRepository.update(auth.id, auth);
  }
}
