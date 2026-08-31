import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { PreparePaymentDto } from '../dto/prepare-payment.dto';
import { Payment, PaymentStatus } from '../entity/payment.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { Shipping } from 'src/domains/order/shipping/entity/shipping.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly configService: ConfigService,
  ) {}

  async prepare(userId: string, dto: PreparePaymentDto) {
    const { cartItemIds, shipping, isDiscount } = dto;

    return this.dataSource.transaction(async (manager) => {
      const cartItems = await manager.find(CartItem, {
        where: {
          id: In(cartItemIds),
          cart: {
            user: { id: userId },
          },
        },
        relations: {
          productSpec: {
            productView: {
              product: true,
            },
          },
          cart: { user: true },
        },
      });
      if (cartItems.length !== cartItemIds.length) {
        throw new BadRequestException('유효하지 않은 장바구니 상품입니다.');
      }

      // 검증만 하고 차감 X
      cartItems.forEach((item) => {
        if (item.quantity > item.productSpec.stock) {
          throw new ConflictException(
            `${item.productSpec.sku}의 재고량이 부족합니다.\n주문: ${item.quantity}\n재고: ${item.productSpec.stock}`,
          );
        }
      });

      // DB에 저장된 상품 가격 기반으로 계산된 총액
      const amount = cartItems.reduce(
        (sum, item) =>
          sum + item.productSpec.productView.product.price * item.quantity,
        isDiscount ? 0 : 3500,
      );

      const orderName =
        cartItems.length === 1
          ? cartItems[0].productSpec.productView.product.name
          : `${cartItems[0].productSpec.productView.product.name} 외 ${cartItems.length - 1}건`;

      // 배송지 생성
      const createdShipping = await manager.save(Shipping, shipping);

      // 주문 생성
      const order = await manager.save(
        manager.create(Order, {
          name: orderName,
          shipping: createdShipping,
          user: { id: userId },
        }),
      );

      // 주문 상품 생성
      const orderItems = cartItems.map((item) =>
        manager.create(OrderItem, {
          name: item.productSpec.productView.product.name,
          color: item.productSpec.productView.color,
          size: item.productSpec.size,
          price: item.productSpec.productView.product.price,
          quantity: item.quantity,
          thumbnail: item.productSpec.productView.product.thumbnail,
          cartItemId: item.id,
          order,
          productSpec: item.productSpec,
        }),
      );

      await manager.save(orderItems);

      const payment = await manager.save(
        manager.create(Payment, {
          order,
          orderId: order.id,
          amount,
          user: { id: userId },
        }),
      );

      return {
        orderId: order.id,
        amount: payment.amount,
        orderName: order.name,
      };
    });
  }

  async confirm(userId: string, dto: ConfirmPaymentDto): Promise<Order> {
    const { paymentKey, amount, orderId } = dto;

    // 주문 조회
    const order = await this.dataSource.manager.findOne(Order, {
      where: {
        id: orderId,
        user: { id: userId },
      },
      relations: {
        orderItems: {
          productSpec: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('결제 시도 중 주문 조회에 실패하였습니다.');
    }

    const payment = await this.dataSource.transaction(async (manager) => {
      // 결제 정보 조회
      const payment = await manager.findOne(Payment, {
        where: {
          order: { id: orderId },
        },
        lock: { mode: 'pessimistic_write' }, // Pessimistic locks require an active database transaction
      });

      if (!payment) {
        throw new NotFoundException('준비된 결제 정보를 찾을 수 없습니다.');
      }

      if (payment.status === PaymentStatus.PAID) {
        throw new NotAcceptableException('이미 결제 완료된 주문건입니다.');
      }

      if (payment.amount !== amount) {
        throw new BadRequestException(
          '결제 금액이 서버에 저장된 금액과 다릅니다.',
        );
      }

      // 주문 상품들 locking해서 조회
      const lockedSpecs = await Promise.all(
        order.orderItems.map(async (item) => {
          const spec = await manager.findOne(ProductSpec, {
            where: {
              id: item.productSpec.id,
            },
            lock: {
              mode: 'pessimistic_write',
            },
          });

          if (!spec) {
            throw new NotFoundException(
              '주문 생성 중 상품 조회에 실패하였습니다.',
            );
          }

          return { spec, quantity: item.quantity };
        }),
      );

      // 재고 감소
      for (const { spec, quantity } of lockedSpecs) {
        if (spec.stock < quantity) {
          throw new ConflictException('주문 상품 재고량이 부족합니다.');
        }

        await manager.decrement(
          ProductSpec,
          { id: spec.id },
          'stock',
          quantity,
        );
      }

      return payment;
    });

    const secretKey = this.configService.get<string>('TOSS_SECRET_KEY');
    if (!secretKey) {
      throw new Error('TOSS_SECRET_KEY가 설정되지 않았습니다.');
    }

    // 토스페이먼츠 결제 승인 요청
    const res = await fetch(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        method: 'POST',
        headers: {
          Authorization:
            'Basic ' + Buffer.from(secretKey + ':').toString('base64'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      },
    );

    const tossPayment = (await res.json()) as {
      code?: string;
      message?: string;
      orderId?: string;
      totalAmount?: number;
      paymentKey?: string;
    };

    await this.dataSource.transaction(async (manager) => {
      // 토스결제 응답이 올바르지 않을 경우
      if (
        !res.ok ||
        tossPayment.orderId !== order.id ||
        tossPayment.totalAmount !== payment.amount
      ) {
        for (const item of order.orderItems) {
          await manager.increment(
            ProductSpec,
            { id: item.productSpec.id },
            'stock',
            item.quantity,
          );
        }

        payment.status = PaymentStatus.FAIL;
        await manager.save(payment);

        throw new BadGatewayException({
          code: tossPayment.code,
          message: tossPayment.message ?? '결제 승인에 실패했습니다.',
        });
      }
    });

    await this.dataSource.transaction(async (manager) => {
      payment.paymentKey = tossPayment.paymentKey ?? paymentKey;
      payment.status = PaymentStatus.PAID;
      await manager.save(payment);

      await manager.delete(CartItem, {
        id: In(order.orderItems.map((item) => item.cartItemId)),
      });
    });

    return order;
  }
}
