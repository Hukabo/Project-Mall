import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import { multerConfig } from 'src/config/multer.config';
import { CloudinaryModule } from 'src/domains/image/module/cloudinary.module';
import { Image } from 'src/domains/image/entity/image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Image]),
    multerConfig,
    CloudinaryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
