import { Injectable, NotFoundException } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { CloudinaryService } from 'src/domains/image/service/cloudinary.service';
import { createProductSchema } from 'src/domains/product/dto/create-product.dto';
import { Repository } from 'typeorm';
import { Category } from 'src/domains/category/entity/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class OpenAiGenerateProductService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async generate(
    categoryName: string,
    item_list: string[],
    prompt = `generate Realistic e-commerce product photography, isolated on pure white background, soft studio lighting, centered composition, ultra high resolution, no logo, no text, no watermark, modern fashion catalog style`,
  ) {
    const openai = new OpenAI();

    const category = await this.categoryRepository.findOneBy({
      name: categoryName,
    });

    if (!category) {
      throw new NotFoundException('해당 카테고리를 찾을 수 없습니다.');
    }

    await openai.responses.create({
      model: 'gpt-5.6',
      input: [],
    });

    const res = await openai.images.generate({
      model: 'gpt-image-1-mini',
      prompt,
      size: '1024x1536',
      quality: 'medium',
    });

    if (!res.data) {
      throw new Error('응답이 올바르지 않습니다.');
    }
    console.log('res = ', res);

    const image_base64 = res.data[0].b64_json ?? null;
    if (!image_base64) {
      throw new Error('이미지 생성에 실패하였습니다.');
    }
    const buffer = Buffer.from(image_base64, 'base64');

    // await this.cloudinaryService.uploadBuffer(buffer, fileName);
  }
}
