import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAiGenerateProductService } from './generateProduct.service';
import { CloudinaryModule } from 'src/domains/image/module/cloudinary.module';
import { CategoryModule } from 'src/domains/category/modules/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CloudinaryModule,
    CategoryModule,
  ],
  providers: [OpenAiGenerateProductService],
})
export class OpenAiGenerateProductModule {}
