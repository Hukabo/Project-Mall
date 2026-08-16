import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from '../../entity/order.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';
import { Size } from 'src/enums/size.enum';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  // 스냅샷을 남기기 위해서 Product와 중복된 컬럼명 사용
  @Column()
  name!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ type: 'enum', enum: Size, nullable: true })
  size!: Size;

  @Column()
  price!: number;

  @Column()
  quantity!: number;

  @Column()
  thumbnail!: string;

  @Column()
  productId!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => ProductSpec, (productSpec) => productSpec.orderItems)
  productSpec!: ProductSpec;
}
