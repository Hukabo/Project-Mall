import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import {
  createProductSchema,
  type CreateProductDto,
} from '../dto/create-product.dto';
import { Product } from '../entity/product.entity';
import {
  updateProductSchema,
  type UpdateProductDto,
} from '../dto/update-product.dto';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import type { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Image } from 'src/domains/image/entity/image.entity';
import { ProductSpec } from '../entity/productSpec.entity';

@Controller('product')
export class ProductController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Post()
  @Roles([Role.ADMIN])
  @UseInterceptors(FilesInterceptor('images'))
  async crete(
    @Body(new ValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<Product> {
    return this.productService.create(createProductDto, files);
  }

  @Get(':id')
  @Public()
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product | null> {
    return this.productService.findById(id);
  }

  @Get()
  @Public()
  async findPage(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
  ): Promise<{}> {
    return await this.productService.findPage(+page, +limit, search?.trim());
  }

  @Get('img/:productId')
  @Public()
  async getImage(@Param('productId') productId): Promise<Image[]> {
    return await this.productService.findImages(productId);
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe(updateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    // return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  async delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.productService.delete(id);
  }
}
