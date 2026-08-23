import { SaleState } from '../../../enums/saleState.enum';
import { Size } from '../../../enums/size.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductView } from './productView.entity';
import { CartItem } from '../../cart/cart_item/entity/cartItem.entity';
import { OrderItem } from '../../order/orderItem/entity/orderItem.entity';
import { TimeStamp } from '../../../embedded_columns/time_stamp';

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
