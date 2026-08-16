import { OrderStatus } from 'src/enums/order-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from '../orderItem/entity/orderItem.entity';
import { User } from 'src/domains/user/entity/user.entity';

import { Payment } from 'src/domains/payment/entity/payment.entity';
import { Shipping } from '../shipping/shipping.entity';
import { TimeStamp } from 'src/embedded_columns/time_stamp';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @OneToOne(() => Shipping, (shipping) => shipping.order)
  @JoinColumn()
  shipping!: Shipping;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems!: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment!: Payment;

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
