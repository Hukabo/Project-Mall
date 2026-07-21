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

  // 스냅샷을 남기기 위해서 Product와 중복된 컬럼명 사용
  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column()
  description!: string;

  @Column()
  quantity!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn()
  product!: Product;
}
