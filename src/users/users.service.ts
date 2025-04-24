import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  async createUser(userDto: CreateUserDTO): Promise<User> {
    const user = this.userRepository.create({
      ...userDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.userRepository.getEntityManager().persistAndFlush(user);

    return user;
  }
}
