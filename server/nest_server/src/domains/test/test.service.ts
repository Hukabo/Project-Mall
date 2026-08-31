import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Like } from 'typeorm';
import { ProductSpec } from '../product/entity/productSpec.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async orderWithoutLock(productSpecId: number, quantity: number) {
    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(ProductSpec, {
        where: {
          id: productSpecId,
        },
      });

      if (!product) {
        throw new NotFoundException('상품 조회 실패 ');
      }

      if (product.stock < quantity) {
        throw new ConflictException('상품 수량 부족');
      }

      // 동시성 문제를 구현하기 위한 지연
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      return await manager.decrement(
        ProductSpec,
        { id: productSpecId },
        'stock',
        quantity,
      );
    });
  }

  async orderWithPessimisticLock(productSpecId: number, quantity: number) {
    return this.dataSource.transaction(async (manager) => {
      const spec = await manager
        .getRepository(ProductSpec)
        .createQueryBuilder('spec')
        .where('spec.id = :id', {
          id: productSpecId,
        })
        .setLock('pessimistic_write')
        .getOne();

      if (!spec) {
        throw new NotFoundException('상품 조회 실패');
      }

      if (spec.stock < quantity) {
        throw new BadRequestException('재고 부족');
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      return await manager.decrement(
        ProductSpec,
        { id: productSpecId },
        'stock',
        quantity,
      );
    });
  }

  async orderWithAtomicUpdate(productSpecId: number, quantity: number) {
    return this.dataSource.transaction(async (manager) => {
      const result = await manager
        .createQueryBuilder()
        .update(ProductSpec)
        .set({
          stock: () => `stock - ${quantity}`,
        })
        .where('id = :id', {
          id: productSpecId,
        })
        .andWhere('stock >= :quantity', {
          quantity,
        })
        .execute();

      if (result.affected !== 1) {
        throw new BadRequestException('상품 재고 부족');
      }

      return result;
    });
  }
}
