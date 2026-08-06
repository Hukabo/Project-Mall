import { SaleState } from 'src/enums/saleState.enum';
import { Size } from 'src/enums/size.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductView } from './productView.entity';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import { TimeStamp } from 'src/embedded_columns/time_stamp';

@Entity()
export class ProductSpec {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'enum', enum: Size, default: Size.M_SIZE })
  size!: Size;

  @Column({ default: 0 })
  stock!: number;

  @Column({ type: 'enum', enum: SaleState, default: SaleState.ON_SALE })
  state!: SaleState;

  @Column()
  sku!: string;

  @ManyToOne(() => ProductView, (productView) => productView.productSpecs, {
    onDelete: 'CASCADE',
  })
  productView!: ProductView;

  @OneToMany(() => CartItem, (cartItem) => cartItem.productSpec)
  cartItems!: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productSpec)
  orderItems!: OrderItem[];

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
