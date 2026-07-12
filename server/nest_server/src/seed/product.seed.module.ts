import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/domains/category/entity/category.entity';
import { CategoryModule } from 'src/domains/category/modules/category.module';
import { Product } from 'src/domains/product/entity/product.entity';
import { ProductSeedService } from './product.seed.service';
import { ConfigModule } from '@nestjs/config';
import dbConfig from 'src/config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    TypeOrmModule.forFeature([Product, Category]),
    CategoryModule,
  ],
  providers: [ProductSeedService],
})
export class ProductSeedModule {}
