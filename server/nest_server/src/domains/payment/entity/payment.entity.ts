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

  // 결제가 주문 FK를 소유합니다. 한 주문에는 하나의 결제만 연결됩니다.
  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
