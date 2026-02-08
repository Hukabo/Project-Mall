import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto): unknown {
    // TODO: 유저 등록

    this.userService.create(createUserDto);

    return createUserDto;
  }

  @Get(':id')
  find(@Param('id') id: string): unknown {
    // TODO: 특정 유저 조회

    return;
  }

  @Get('users')
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
