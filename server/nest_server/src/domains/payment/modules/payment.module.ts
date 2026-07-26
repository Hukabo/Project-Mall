import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { PaymentController } from '../controllers/payment.controller';
import { Payment } from '../entity/payment.entity';
import { PaymentService } from '../services/payment.service';
import { Order } from 'src/domains/order/entity/order.entity';
import { Shipping } from 'src/domains/order/shipping/shipping.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Payment, CartItem, Order, Shipping])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
