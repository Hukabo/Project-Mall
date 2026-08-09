import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/domains/user/entity/user.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { TimeStamp } from 'src/embedded_columns/time_stamp';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAIL = 'FAIL',
  CANCELED = 'CANCELED',
}

/** 결제창을 열기 전에 만든 서버 기준 결제 정보입니다. */
@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 64 })
  orderId!: string;

  @Column('int')
  amount!: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  paymentKey!: string | null;

  @ManyToOne(() => User)
  user!: User;

  @OneToOne(() => Order, (order) => order.payment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
