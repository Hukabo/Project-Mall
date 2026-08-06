import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import { Payment } from 'src/domains/payment/entity/payment.entity';
import { Shipping } from 'src/domains/order/shipping/shipping.entity';
import { Image } from 'src/domains/image/entity/image.entity';
import { ProductView } from 'src/domains/product/entity/productView.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    Product,
    ProductView,
    ProductSpec,
    Image,
    Category,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Shipping,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
  // logging: true,
}));
