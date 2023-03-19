import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserProfileDto } from '../dtos/update-user.dto';
import { CreateUserDto } from "../dtos/create-user.dto";
import { AuthHelper } from "../../auth/helpers/auth.helper";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findOneByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOneBy({ email });
  }
  
  async findOne(id: string) {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateOne(id: string, dto: UpdateUserProfileDto) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User dose not exist!');
    }
    const preload = await this.usersRepository.preload({
      ...dto,
      id: id,
    });

    return await this.usersRepository.save(preload);
  }

  async createOne(dto: CreateUserDto) {
    const isExist = await this.findOneByEmail(dto.email);

    if (isExist) {
      throw new BadRequestException('User already exist');
    }

    const hashedPassword = await AuthHelper.hash(dto.password);

    const userInstance = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepository.save(userInstance);
  }

}
