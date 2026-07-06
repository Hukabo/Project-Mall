import { Module } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), 'asset', 'products_images'),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 3,
      },
      fileFilter: (_req, file, cb) => {
        const allowed = ['image/png', 'image/jpeg', 'image/jpg'];

        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new Error(`지원하지 않는 파일 형식입니다: ${file.mimetype}`),
            false,
          );
        }
      },
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
