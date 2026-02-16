import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerError } from 'src/errors/internal-server.error';
import { CreateUserDto } from '../dto/create-user.schema';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Something went wrong while creating a user...',
        error,
      );
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Something went wrong while finding all of users...',
        error,
      );
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const findUser = await this.userRepository.findOneBy({ id });

      if (findUser === null)
        throw new NotFoundException('the user not exists...');

      return findUser;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while finding the user...',
        error,
      );
    }
  }

  async delete(id: number): Promise<string> {
    try {
      const res = await this.userRepository.delete(id);

      if (!res.affected) {
        throw new NotFoundException('No user exists...');
      }

      return 'delete user success...';
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while deleting the user...',
        error,
      );
    }
  }
}
