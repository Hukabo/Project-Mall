import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { CartController } from '../controllers/cart.controller';
import { Cart } from '../entity/cart.entity';
import { CartService } from '../services/cart.service';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, ProductSpec, CartItem, User]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [TypeOrmModule],
})
export class CartModule {}
