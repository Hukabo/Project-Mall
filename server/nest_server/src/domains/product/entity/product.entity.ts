import { Category } from 'src/domains/category/entity/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductView } from './productView.entity';
import { TimeStamp } from 'src/embedded_columns/time_stamp';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column({
    nullable: true,
  })
  discount!: number;

  @Column()
  thumbnail!: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  category!: Category;

  @OneToMany(() => ProductView, (productView) => productView.product)
  productViews!: ProductView[]; // 상품의 이미지와 색상을 담당하는 Entity

  @Column(() => TimeStamp)
  timeStamp!: TimeStamp;
}
