import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('users')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  @Public()
  @UsePipes(new ValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const res = await this.userService.create(createUserDto);

    return res;
  }

  @Get('profile')
  getProfile(@CurrentUser('id') userId: string) {
    return this.userService.findOne(userId);
  }

  @Get(':id')
  find(@Param('id') id: string): Promise<User | null> {
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
    @Param('id') id: string,
    @Body(new ValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const res = this.userService.update(id, updateUserDto);

    return res;
  }

  @Roles([Role.ADMIN])
  @Delete(':id')
  delete(@Param('id') id: string): Promise<string> {
    return this.userService.delete(id);
  }
}
