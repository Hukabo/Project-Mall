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
} from '../dto/update-product.dts';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RoleGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { cwd } from 'process';
import { existsSync } from 'fs';
import type { Response } from 'express';

@Controller('product')
export class ProductController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Post()
  @Roles([Role.ADMIN])
  @UseInterceptors(FilesInterceptor('images', 3))
  crete(
    @Body(new ValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ): Promise<Product> {
    console.log('files: ', files);

    return this.productService.create(createProductDto, files);
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productService.find(id);
  }

  @Get('images/:filename')
  getImage(@Param('filename') filename, @Res() res: Response) {
    const filePath = join(cwd(), 'asset', 'product_images', filename);

    if (!existsSync(filePath))
      throw new NotFoundException('The path is wrong..');
    return res.sendFile(filePath);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Patch(':id')
  @Roles([Role.ADMIN])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe(updateProductSchema))
    updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles([Role.ADMIN])
  delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.productService.delete(id);
  }
}
