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

  async create(userId: number, dto: CreateOrderDto) {
    const { cartItemIds, shipping, payment } = dto;

    return this.dataSource.transaction(async (manager) => {
      // 장바구니 상품 조회
      const cartItems = await manager.find(CartItem, {
        where: {
          id: In(cartItemIds),
        },
        relations: {
          product: true,
        },
      });

      if (cartItems.length !== dto.cartItemIds.length)
        throw new NotFoundException('장바구니 일부 상품을 찾을 수 없습니다..');

      // 재고 확인
      for (const item of cartItems) {
        if (item.product.stock < item.quantity)
          throw new BadRequestException('상품 수량이 부족합니다..');
      }

      // 주문 총액 계산
      const totalPrice = cartItems.reduce(
        (sum, item) => item.quantity * item.product.price,
        0,
      );

      // 주문 생성
      const order = manager.create(Order, {
        user: { id: userId },
        shippingAddress: shipping.address + shipping.addressDetail,
        totalPrice,
        payment,
        orderItems: cartItems.map((item) =>
          manager.create(OrderItem, {
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            quantity: item.quantity,
            product: item.product,
          }),
        ),
      });

      const savedOrder = await manager.save(order);

      // 재고 차감
      for (const item of cartItems) {
        await manager.decrement(
          Product,
          {
            id: item.product.id,
          },
          'stock',
          item.quantity,
        );
      }

      // 주문 완료된 상품 장바구니에서 제거
      await manager.delete(CartItem, { id: In(cartItemIds) });

      return savedOrder;
    });
  }

  // async create(
  //   userId: number,
  //   createOrderItemDtos: CreateOrderItemDto[],
  // ): Promise<Order> {
  //   // TODO: 트랜젝션 적용하기.
  //   try {
  //     const user = await this.userRepository.findOne({
  //       where: {
  //         id: userId,
  //       },
  //       relations: {
  //         cart: true,
  //       },
  //     });

  //     if (!user) {
  //       throw new NotFoundException('the user is not exists...');
  //     }

  //     const cart: Cart = user.cart;

  //     if (!cart) {
  //       throw new NotFoundException('the cart is not exists...');
  //     }

  //     const createdOrder = this.orderRepository.create({
  //       shippingAddress: user.address,
  //       user,
  //       totalPrice: 0,
  //       orderItems: [],
  //     });

  //     const order = await this.orderRepository.save(createdOrder);

  //     const items = await this.cartItemRepository.find({
  //       where: {
  //         cart,
  //       },
  //       relations: {
  //         product: true,
  //       },
  //     });

  //     if (!items.length) {
  //       throw new NotFoundException('the cart is empty...');
  //     }

  //     let totalPrice = 0;

  //     for (let i = 0; i < items.length; i++) {
  //       const item: CartItem = items[i];

  //       const product: Product = item.product;

  //       if (!product) {
  //         throw new NotFoundException('the product is not exists...');
  //       } else if (product.stock < item.quantity) {
  //         throw new ConflictException('the product is out of stock...');
  //       }

  //       product.stock -= item.quantity;
  //       await this.productRepository.save(product);

  //       totalPrice += product.price * item.quantity;

  //       const newItem = this.orderItemRepository.create({
  //         name: product.name,
  //         price: product.price,
  //         description: product.description,
  //         quantity: item.quantity,
  //         product,
  //         order,
  //       });

  //       const savedItem = await this.orderItemRepository.save(newItem);

  //       order.orderItems.push(savedItem);

  //       await this.cartItemRepository.delete(item.id);
  //     }

  //     order.totalPrice = totalPrice;

  //     const savedOrder = await this.orderRepository.save(order);

  //     return savedOrder;
  //   } catch (error) {
  //     console.error(error);

  //     if (error instanceof HttpException) {
  //       throw error;
  //     }

  //     throw new InternalServerError(
  //       'Something went wrong while creating the order...',
  //     );
  //   }
  // }

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
