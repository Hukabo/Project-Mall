import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Category } from 'src/domains/category/entity/category.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  stock!: number;

  @Column('varchar', {
    array: true,
    nullable: true,
  })
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product, {
    cascade: true,
  })
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems!: OrderItem[];
}
