import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { type CreateProductDto } from '../dto/product.dto';
import { Product } from '../entity/product.entity';

@Controller('product')
export class ProductController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Post()
  crete(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number): Promise<Product | null> {
    return this.productService.find(id);
  }

  @Get()
  findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.productService.delete(id);
  }
}
