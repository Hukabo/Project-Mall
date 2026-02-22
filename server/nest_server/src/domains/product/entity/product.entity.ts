import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    cascade: true,
  })
  cartItems: CartItem[];
}
