import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InternalServerError } from 'src/errors/internal-server.error';
import { CreateUserDto } from '../dto/create-user.dto';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | undefined,
  ) {
    return await this.userRepository.update(
      { id: userId },
      { hashedRefreshToken },
    );
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('the user is already exists...');
      }

      const user = this.userRepository.create(createUserDto);
      const cart = this.cartRepository.create({ user });
      user.cart = cart;

      const savedUser = await this.userRepository.save(user);
      return new ResponseUserDto(savedUser);
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

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

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) throw new NotFoundException('the user not exists...');

      return user;
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

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found..');
      }

      return user;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { username, password, address } = updateUserDto;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('the user not exists...');
    }
    user.username = username;
    user.password = password;
    user.address = address;

    return await this.userRepository.save(user);
  }

  async delete(id: number): Promise<string> {
    try {
      const res = await this.userRepository.delete(id);

      if (!res.affected) {
        throw new NotFoundException('No user exists...');
      }

      return 'the user was deleted successfully...';
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
