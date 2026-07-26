import { OrderStatus } from 'src/enums/status.enum';
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
import { PaymentMethod } from 'src/enums/payment.enum';
import { Payment } from 'src/domains/payment/entity/payment.entity';
import { Shipping } from '../shipping/shipping.entity';

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

  // 주문이 배송지 FK를 소유합니다. 관계의 소유자는 1:1 관계에서 한쪽만 있어야 합니다.
  @OneToOne(() => Shipping, (shipping) => shipping.order)
  @JoinColumn({ name: 'shipping_id' })
  shipping!: Shipping;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  orderItems!: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment!: Payment;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
