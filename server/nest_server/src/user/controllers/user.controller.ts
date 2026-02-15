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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  type CreateUserDto,
  createUserSchema,
} from '../dto/create-user.schema';
import { UserService } from '../services/user.service';
import { User } from '../entity/user.entity';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('users')
@UseGuards(RoleGuard)
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  @Roles([Role.ADMIN, Role.USER])
  @UsePipes(new ValidationPipe(createUserSchema))
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
  find(@Param('id', ParseIntPipe) id: number): unknown {
    // TODO: 특정 유저 조회

    return;
  }

  @Get()
  @Roles([Role.ADMIN])
  findAll() {
    // TODO: 모든 유저 조회

    const res = this.userService.findAll();

    return res;
  }

  @Patch(':id')
  modify(@Param('id', ParseIntPipe) id: number): unknown {
    // TODO: 특정 유저 수정

    return;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): unknown {
    // TODO: 특정 유저 삭제

    return;
  }
}
