import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../entity/order.entity';
import { Product } from 'src/domains/product/entity/product.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn()
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn()
  product!: Product;
}
