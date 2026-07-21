import { OrderStatus } from 'src/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../orderItem/entity/orderItem.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { PaymentMethod } from 'src/enums/payment.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  shippingAddress!: string;

  @Column()
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  payment!: PaymentMethod;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  orderItems!: OrderItem[];
}
