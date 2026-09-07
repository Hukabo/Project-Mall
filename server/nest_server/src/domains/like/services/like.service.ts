import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from '../entity/like.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { InternalServerError } from 'src/errors/internal-server.error';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async toggle(userId: string, productId: number): Promise<{ liked: boolean }> {
    try {
      const product = await this.productRepository.findOneBy({
        id: productId,
      });

      if (!product) {
        throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
      }

      const existing = await this.likeRepository.findOne({
        where: { user: { id: userId }, product: { id: productId } },
      });

      if (existing) {
        await this.likeRepository.delete({ id: existing.id });

        return { liked: false };
      }

      await this.likeRepository.save(
        this.likeRepository.create({ user: { id: userId }, product }),
      );

      return { liked: true };
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while toggling the like...',
        error,
      );
    }
  }

  async isLiked(userId: string, productId: number): Promise<{ liked: boolean }> {
    try {
      const count = await this.likeRepository.count({
        where: { user: { id: userId }, product: { id: productId } },
      });

      return { liked: count > 0 };
    } catch (error) {
      console.error(error);

      throw new InternalServerError(
        'Something went wrong while checking the like status...',
        error,
      );
    }
  }
}
