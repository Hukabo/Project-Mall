import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/domains/category/entity/category.entity';
import { CategoryService } from 'src/domains/category/services/category.service';
import { Product } from 'src/domains/product/entity/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly categoryService: CategoryService,
  ) {}

  async seed(count = 100) {
    console.log(`📦 상품 ${count}개 생성 중...`);

    const categoriesId: number[] = await this.categoryService.findChildren();

    const products = Array.from({ length: count }, () => ({
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price({ min: 1000, max: 300000, dec: 0 })),
      stock: faker.number.int({ min: 0, max: 500 }),
      description: faker.commerce.productDescription(),
      category: { id: faker.helpers.arrayElement(categoriesId) },
    }));

    await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(products)
      .execute();

    console.log(`✅ 상품 ${count}개 저장 완료`);
  }
}
