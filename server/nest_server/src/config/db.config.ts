import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Cart } from 'src/domains/cart/entity/cart.entity';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Product, Category, Cart, CartItem],
    synchronize: process.env.NODE_ENV !== 'production',
    // logging: true,
  }),
);
