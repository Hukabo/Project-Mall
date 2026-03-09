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
  Req,
  Res,
  UseFilters,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { type CreateUserDto, createUserSchema } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { User } from '../entity/user.entity';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { DeleteResult } from 'typeorm';
import { type UpdateUserDto, updateUserSchema } from '../dto/update-user.dto';
import { ResponseUserDto } from '../dto/response-user.dto';
import { JwtAuthGuard } from 'src/domains/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('users')
@UseGuards(RoleGuard)
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  @UsePipes(new ValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const res = await this.userService.create(createUserDto);

    return res;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const res = this.userService.update(id, updateUserDto);

    return res;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.delete(id);
  }
}
