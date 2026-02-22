import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
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

@Controller('product')
@UseGuards(RoleGuard)
export class ProductController {
  private readonly productService: ProductService;
  constructor(productService: ProductService) {
    this.productService = productService;
  }

  @Post()
  @Roles([Role.ADMIN])
  crete(
    @Body(new ValidationPipe(createProductSchema))
    createProductDto: CreateProductDto,
  ): Promise<Product> {
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
