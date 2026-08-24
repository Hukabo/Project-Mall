import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from '../orderItem/entity/orderItem.entity';
import { User } from '../../user/entity/user.entity';

import { Payment } from '../../payment/entity/payment.entity';
import { Shipping } from '../shipping/entity/shipping.entity';
import { TimeStamp } from '../../../embedded_columns/time_stamp';
import { OrderStatus } from '../../../enums/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PREPARING,
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
