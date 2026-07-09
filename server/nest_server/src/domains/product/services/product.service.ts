import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { InternalServerError } from 'src/errors/internal-server.error';
import { Category } from 'src/domains/category/entity/category.entity';
import { UpdateProductDto } from '../dto/update-product.dts';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: createProductDto.categoryId,
      });

      if (!category) {
        throw new NotFoundException('해당 카테고리는 없습니다.');
      }

      console.log(files);
      if (!files || files.length === 0) {
        throw new BadRequestException(
          '이미지 파일은 1장 이상 업로드 되어야합니다.',
        );
      }
      files.forEach((file) => {
        console.log('file: ', file);
      });

      const images = files.map((file) => file.filename);

      const product = this.productRepository.create({
        ...createProductDto,
        category,
        images,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      console.error(error);

      throw new InternalServerError(
        'Something went wrong while creating the product...',
        error,
      );
    }
  }

  async find(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: {
          category: true,
        },
      });

      if (product === null)
        throw new NotFoundException('the product not exists...');

      return product;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while finding the product...',
        error,
      );
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      console.error(error);
      throw new InternalServerError(
        'Something went wrong while finding all of products...',
        error,
      );
    }
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { name, description, price, stock, categoryId } = updateProductDto;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException('the product is not exists...');
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;

    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });
      if (category) {
        product.category = category;
      }
    }

    return await this.productRepository.save(product);
  }

  async delete(id: number): Promise<string> {
    try {
      const res = await this.productRepository.delete(id);

      if (!res.affected) {
        throw new NotFoundException('the product not exists...');
      }

      return 'delete product success...';
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while deleting the product...',
        error,
      );
    }
  }
}
