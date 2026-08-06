import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/domains/user/entity/user.entity';
import { OrderItem } from '../orderItem/entity/orderItem.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { OrderStatus } from 'src/enums/status.enum';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const { orderId, cartItemIds } = dto;

    return this.dataSource.transaction(async (manager) => {
      // 장바구니 상품 조회
      const cartItems = await manager.find(CartItem, {
        where: {
          id: In(cartItemIds),
        },
        relations: {
          productSpec: {
            productView: {
              product: true,
            },
          },
        },
      });

      if (cartItems.length !== dto.cartItemIds.length)
        throw new NotFoundException('장바구니 일부 상품을 찾을 수 없습니다..');

      // 재고 확인
      for (const item of cartItems) {
        if (item.productSpec.stock < item.quantity)
          throw new BadRequestException('상품 수량이 부족합니다..');
      }

      // 주문 조회
      const order = await manager.findOne(Order, {
        where: {
          id: orderId,
        },
        relations: {
          payment: true,
        },
      });

      if (!order) {
        throw new NotFoundException('해당 주문을 찾을 수 없습니다.');
      }

      // 주문 생성
      const orderItems = cartItems.map((item) => {
        return manager.create(OrderItem, {
          name: item.productSpec.productView.product.name,
          price: item.productSpec.productView.product.price,
          description: item.productSpec.productView.product.description,
          quantity: item.quantity,
          order,
        });
      });

      await manager.save(Order, {
        ...order,
        orderItems,
      });

      // 재고 차감
      for (const item of cartItems) {
        await manager.decrement(
          Product,
          {
            id: item.productSpec.productView.product.id,
          },
          'stock',
          item.quantity,
        );
      }

      // 주문 완료된 상품 장바구니에서 제거
      await manager.delete(CartItem, { id: In(cartItemIds) });

      return order;
    });
  }

  async find(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException('the order is not exists..');
    }

    return order;
  }

  async findAll(userId: string) {
    return this.orderRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        orderItems: true,
      },
    });
  }

  async update(orderId: string, orderStatus: OrderStatus): Promise<Order> {
    const order = await this.find(orderId);

    order.status = orderStatus;

    return await this.orderRepository.save(order);
  }
}
