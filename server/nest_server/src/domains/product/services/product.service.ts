import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/product.dto';
import { InternalServerError } from 'src/errors/internal-server.error';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(product: CreateProductDto): Promise<Product> {
    try {
      return await this.productRepository.save(product);
    } catch (error) {
      console.error(error);

      throw new InternalServerError(
        'Something went wrong while creating the product...',
        error,
      );
    }
  }

  async find(id: number): Promise<Product | null> {
    try {
      const res = await this.productRepository.findOneBy({ id });

      if (res === null)
        throw new NotFoundException('the product not exists...');

      return res;
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
