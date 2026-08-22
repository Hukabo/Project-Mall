import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { PreparePaymentDto } from '../dto/prepare-payment.dto';
import { Payment, PaymentStatus } from '../entity/payment.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { Shipping } from 'src/domains/order/shipping/entity/shipping.entity';
import { InternalServerError } from 'src/errors/internal-server.error';
import { OrderStatus } from 'src/enums/order-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

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

      cartItems.forEach((item) => {
        if (item.quantity > item.productSpec.stock) {
          throw new ConflictException(
            `${item.productSpec.sku}의 재고량이 부족합니다.\n주문: ${item.quantity}\n재고: ${item.productSpec.stock}`,
          );
        }
      });

      const amount = cartItems.reduce(
        (sum, item) =>
          sum + item.productSpec.productView.product.price * item.quantity,
        isDiscount ? 0 : 3500,
      );
      const orderName =
        cartItems.length === 1
          ? cartItems[0].productSpec.productView.product.name
          : `${cartItems[0].productSpec.productView.product.name} 외 ${cartItems.length - 1}건`;

      const createdShipping = await manager.save(Shipping, shipping);

      const order = await manager.save(
        manager.create(Order, {
          name: orderName,
          shipping: createdShipping,
          user: { id: userId },
        }),
      );

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

  async confirm(userId: string, dto: ConfirmPaymentDto) {
    const payment = await this.paymentRepository.findOne({
      where: {
        order: { id: dto.orderId },
        user: { id: userId },
      },
      relations: {
        order: true,
      },
    });

    if (!payment)
      throw new NotFoundException('준비된 결제 정보를 찾을 수 없습니다.');

    if (payment.status === PaymentStatus.PAID)
      throw new ConflictException('이미 승인된 결제입니다.');

    if (payment.amount !== dto.amount)
      throw new BadRequestException(
        '결제 금액이 서버에 저장된 금액과 다릅니다.',
      );

    const secretKey = this.configService.get<string>('TOSS_SECRET_KEY');

    if (!secretKey) throw new Error('TOSS_SECRET_KEY가 설정되지 않았습니다.');

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

    console.log('tossPayment = ', tossPayment);

    if (!res.ok) {
      payment.status = PaymentStatus.FAIL;
      await this.paymentRepository.save(payment);

      throw new BadGatewayException({
        code: tossPayment.code,
        message: tossPayment.message ?? '토스페이먼츠 승인에 실패했습니다.',
      });
    }
    if (
      tossPayment.orderId !== payment.order.id ||
      tossPayment.totalAmount !== payment.amount
    ) {
      payment.status = PaymentStatus.FAIL;
      await this.paymentRepository.save(payment);

      throw new BadGatewayException(
        '토스페이먼츠 승인 결과의 주문 정보가 일치하지 않습니다.',
      );
    }
    payment.status = PaymentStatus.PAID;
    payment.paymentKey = tossPayment.paymentKey ?? dto.paymentKey;

    await this.paymentRepository.save(payment);
    await this.dataSource.manager.update(Order, dto.orderId, {
      status: OrderStatus.PAID,
    });

    return tossPayment;
  }
}
