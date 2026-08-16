import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiGenerateProductService } from './generateProduct.service';
import { CloudinaryModule } from 'src/domains/image/module/cloudinary.module';
import { CategoryModule } from 'src/domains/category/modules/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/domains/category/entity/category.entity';
import dbConfig from 'src/config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [dbConfig] }),
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    TypeOrmModule.forFeature([Category]),
    CloudinaryModule,
  ],
  providers: [OpenAiGenerateProductService],
})
export class OpenAiGenerateProductModule {}
