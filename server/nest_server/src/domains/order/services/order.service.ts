import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/domains/user/entity/user.entity';
import { OrderItem } from '../orderItem/entity/orderItem.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { InternalServerError } from 'src/errors/internal-server.error';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { OrderStatus } from 'src/enums/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async create(userId: number): Promise<Order> {
    // TODO: 트랜젝션 적용하기.
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          cart: true,
        },
      });

      if (!user) {
        throw new NotFoundException('the user is not exists...');
      }

      const cart: Cart = user.cart;

      if (!cart) {
        throw new NotFoundException('the cart is not exists...');
      }

      const createdOrder = this.orderRepository.create({
        shippingAddress: user.address,
        user,
        totalPrice: 0,
        orderItems: [],
      });

      const order = await this.orderRepository.save(createdOrder);

      console.log('createdOrder = ', createdOrder);

      const items = await this.cartItemRepository.find({
        where: {
          cart,
        },
        relations: {
          product: true,
        },
      });

      console.log('items = ', items);

      if (!items.length) {
        throw new NotFoundException('the cart is empty...');
      }

      let totalPrice = 0;

      for (let i = 0; i < items.length; i++) {
        const item: CartItem = items[i];

        const product: Product = item.product;

        if (!product) {
          throw new NotFoundException('the product is not exists...');
        } else if (product.stock < item.quantity) {
          throw new ConflictException('the product is out of stock...');
        }

        product.stock -= item.quantity;
        await this.productRepository.save(product);

        totalPrice += product.price * item.quantity;

        const newItem = this.orderItemRepository.create({
          quantity: item.quantity,
          product: product,
          order: order,
        });

        const savedItem = await this.orderItemRepository.save(newItem);

        order.orderItems.push(savedItem);

        console.log(newItem);
        await this.cartItemRepository.delete(item.id);
      }

      order.totalPrice = totalPrice;

      const savedOrder = await this.orderRepository.save(order);

      return savedOrder;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while creating the order...',
      );
    }
  }

  async find(orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      relations: {
        orderItems: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('the order is not exists..');
    }

    return order;
  }

  async findAll(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        orders: {
          orderItems: {
            product: true,
          },
        },
      },
    });

    console.log('user = ', user);

    if (!user) {
      throw new NotFoundException('the user is not exists...');
    }

    return user.orders;
  }

  async update(orderId: number, orderStatus: OrderStatus): Promise<Order> {
    const order = await this.find(orderId);

    order.status = orderStatus;

    return await this.orderRepository.save(order);
  }
}
