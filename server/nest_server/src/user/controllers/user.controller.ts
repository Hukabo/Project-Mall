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
import { User } from '../entities/user.entity';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { DeleteResult } from 'typeorm';

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
    const res = await this.userService.create(createUserDto);

    return res;
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    const res = this.userService.findOne(id);

    return res;
  }

  @Get()
  @Roles([Role.ADMIN])
  findAll(): Promise<User[]> {
    const res = this.userService.findAll();

    return res;
  }

  @Patch(':id')
  modify(@Param('id', ParseIntPipe) id: number): unknown {
    return;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.delete(id);
  }
}
