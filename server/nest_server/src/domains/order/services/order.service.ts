import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

import { OrderStatus } from 'src/enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

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
      select: {
        id: true,
        name: true,
        status: true,
        timeStamp: {
          createdAt: true,
        },
      },
    });
  }

  async update(orderId: string, orderStatus: OrderStatus): Promise<Order> {
    const order = await this.find(orderId);

    order.status = orderStatus;

    return await this.orderRepository.save(order);
  }
}
