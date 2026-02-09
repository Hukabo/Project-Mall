import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../entity/user.entity';
import { CatchEverythingFilter } from 'src/filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

@Controller('users')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // TODO: 유저 등록

    try {
      const res = await this.userService.create(createUserDto);

      return res;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          message: 'An error occurred while creating the user...',
          error: 'Not Acceptable',
        },
        HttpStatus.NOT_ACCEPTABLE,
        {
          cause: error,
        },
      );
    }
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: string): unknown {
    // TODO: 특정 유저 조회

    return;
  }

  @Get()
  findAll() {
    // TODO: 모든 유저 조회

    const res = this.userService.findAll();

    return res;
  }

  @Patch(':id')
  modify(@Param('id') id: string): unknown {
    // TODO: 특정 유저 수정

    return;
  }

  @Delete(':id')
  delete(@Param('id') id: string): unknown {
    // TODO: 특정 유저 삭제

    return;
  }
}
