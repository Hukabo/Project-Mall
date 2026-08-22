import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../entity/order.entity';

@Entity('shipping')
export class Shipping {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @Column()
  addressDetail!: string;

  @Column()
  zipcode!: number;

  @Column()
  memo!: string;

  @OneToOne(() => Order, (order) => order.shipping)
  order!: Order;
}
