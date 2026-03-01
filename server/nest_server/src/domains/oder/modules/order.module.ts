import { Module } from '@nestjs/common';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from '../services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entity/order.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { OrderItem } from '../oderItem/entity/orderItem.entity';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Product, CartItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
