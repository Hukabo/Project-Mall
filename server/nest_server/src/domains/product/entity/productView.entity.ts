import { Image } from '../../image/entity/image.entity';

import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductSpec } from './productSpec.entity';
import { TimeStamp } from '../../../embedded_columns/time_stamp';

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
