import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { CloudinaryService } from 'src/domains/image/service/cloudinary.service';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Category } from 'src/domains/category/entity/category.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import z from 'zod/v3';
import { Size } from 'src/enums/size.enum';
import { zodTextFormat } from 'openai/helpers/zod.mjs';
import { Product } from 'src/domains/product/entity/product.entity';
import { ProductView } from 'src/domains/product/entity/productView.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';
import { SaleState } from 'src/enums/saleState.enum';
import { Image } from 'src/domains/image/entity/image.entity';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class OpenAiGenerateProductService {
  private readonly openai = new OpenAI();

  constructor(
    private readonly cloudinaryService: CloudinaryService,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async generate(
    items: string[],
    prompt = `generate Realistic e-commerce product photography, isolated on pure white background, soft studio lighting, centered composition, ultra high resolution, no logo, no text, no watermark, modern fashion catalog style`,
  ) {
    const categories = await this.dataSource
      .getRepository(Category)
      .createQueryBuilder('category')
      .leftJoin('category.children', 'child')
      .where('child.id IS NULL')
      .select(['category.id', 'category.name'])
      .getMany();

    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.name, c.id]),
    );

    const categoryNames = Object.keys(categoryMap);

    const ProductSchema = z.object({
      name: z.string().min(3).max(20),
      description: z.string(),
      price: z.number().min(1000).max(100000),
      variants: z
        .array(
          z.object({
            color: z.string().nullable().optional(),
            // imageCount: z.number().min(1).max(3),
            sizeStocks: z.array(
              z.object({
                size: z.nativeEnum(Size),
                stock: z.number().min(5).max(500),
              }),
            ),
          }),
        )
        .min(1),

      categoryName: z
        .string()
        .refine((value) => categoryNames.includes(value), {
          message: `카테고리 이름은 다음 중 하나여야 합니다. ${categoryNames.join(', ')}`,
        }),
    });

    try {
      await this.dataSource.transaction(async (manager) => {
        for (const item of items) {
          // 상품 정보 생성
          const data = await this.openai.responses.parse({
            model: 'gpt-5.6',
            input: [
              {
                role: 'system',
                content: `
                You are AI that create product data. 
                
                Available categories:
                ${categoryNames.join(', ')}
  
                The categoryName must be one of the available categories.
                

                `,
              },
              {
                role: 'user',
                content: `
                다음 상품 정보를 바탕으로 상품 데이터를 생성해줘.
  
                상품:${item}
              `,
              },
            ],
            text: {
              format: zodTextFormat(ProductSchema, 'product'),
            },
          });

          if (!data.output_parsed) {
            throw new Error('상품 정보 생성 오류');
          }

          const product = data.output_parsed;

          const uploadResults: UploadApiResponse[] = [];

          // 상품 이미지 생성 (Variant 당 1장씩만)
          for (const variant of product.variants) {
            const result = await this.openai.images.generate({
              model: 'gpt-image-1-mini',
              prompt: prompt + variant.color + product.name,
              size: '1024x1024',
              quality: 'medium',
            });

            if (!result.data) {
              throw new Error('상품 이미지 생성 오류');
            }

            const image_base64 = result.data[0].b64_json;

            if (!image_base64) {
              throw new Error('이미지 데이터가 없습니다.');
            }
            const image_bytes = Buffer.from(image_base64, 'base64');

            const uploadResult = await this.cloudinaryService.uploadBuffer(
              image_bytes,
              product.name,
            );

            uploadResults.push(uploadResult);
          }

          // Product 생성
          const createdProduct = await manager.save(Product, {
            name: product.name,
            description: product.description,
            price: product.price,
            category: {
              id: categoryMap[product.categoryName],
            },
            thumbnail: uploadResults[0].secure_url,
          });

          // ProductView 생성
          for (const [i, variant] of product.variants.entries()) {
            const productView = await manager.save(ProductView, {
              color: variant.color ?? '',
              product: createdProduct,
            });

            // 이미지 DB 저장
            await manager.save(Image, {
              id: uploadResults[i].public_id,
              secure_url: uploadResults[i].secure_url,
              name: uploadResults[i].original_filename,
              format: uploadResults[i].format,
              productView,
            });

            for (const sizeStock of variant.sizeStocks) {
              await manager.save(ProductSpec, {
                size: sizeStock.size,
                stock: sizeStock.stock,
                state:
                  sizeStock.stock === 0
                    ? SaleState.SOLD_OUT
                    : SaleState.ON_SALE,
                sku: `${product.name}-${variant.color ? `${variant.color}-` : ''}${sizeStock.size}`.toUpperCase(),
                productView,
              });
            }
          }
          console.log(`${item} 생성 완료`);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}
