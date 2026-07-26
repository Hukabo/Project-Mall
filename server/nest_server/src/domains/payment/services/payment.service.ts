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
import { Shipping } from 'src/domains/order/shipping/shipping.entity';

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
    const { cartItemIds, shipping } = dto;

    return this.dataSource.transaction(async (manager) => {
      const cartItems = await manager.find(CartItem, {
        where: { id: In(cartItemIds), cart: { user: { id: userId } } },
        relations: { product: true, cart: { user: true } },
      });
      if (cartItems.length !== cartItemIds.length) {
        throw new BadRequestException('유효하지 않은 장바구니 상품입니다.');
      }

      const amount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      );
      const orderName =
        cartItems.length === 1
          ? cartItems[0].product.name
          : `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`;

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
      where: { orderId: dto.orderId, user: { id: userId } },
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
    const response = await fetch(
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
    const tossPayment = (await response.json()) as {
      code?: string;
      message?: string;
      orderId?: string;
      totalAmount?: number;
      paymentKey?: string;
    };

    console.log(tossPayment);

    if (!response.ok) {
      payment.status = PaymentStatus.FAIL;
      await this.paymentRepository.save(payment);

      throw new BadGatewayException({
        code: tossPayment.code,
        message: tossPayment.message ?? '토스페이먼츠 승인에 실패했습니다.',
      });
    }
    if (
      tossPayment.orderId !== payment.orderId ||
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
    return tossPayment;
  }
}
