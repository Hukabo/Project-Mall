import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Image } from 'src/domains/image/entity/image.entity';
import { OrderItem } from 'src/domains/order/orderItem/entity/orderItem.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductSpec } from './productSpec.entity';
import { TimeStamp } from 'src/embedded_columns/time_stamp';

@Entity()
export class ProductView {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  color!: string;

  @OneToMany(() => Image, (image) => image.productView, {
    cascade: true,
  })
  images!: Image[];

  @ManyToOne(() => Product, (product) => product.productViews, {
    onDelete: 'CASCADE',
  })
  product!: Product;

  @OneToMany(() => ProductSpec, (productSpec) => productSpec.productView)
  productSpecs!: ProductSpec[];

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
