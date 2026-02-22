import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import {
  createCategorySchema,
  type CreateCategoryDto,
} from '../dto/create-category.dto';
import { InternalServerError } from 'src/errors/internal-server.error';
import {
  updateCategorySchema,
  type UpdateCategoryDto,
} from '../dto/update-category.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@Controller('category')
@UseGuards(RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles([Role.ADMIN])
  async create(
    @Body(new ValidationPipe(createCategorySchema))
    createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOne(id);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe(updateCategorySchema))
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const res = await this.categoryService.delete(id);

      if (!res.affected) {
        throw new NotFoundException('No category exists...');
      }

      return 'the category deleted successfully..';
    } catch (error) {
      console.error;

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while deleting the category...',
        error,
      );
    }
  }
}
