import { ProductView } from '../../product/entity/productView.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryColumn()
  id!: string;

  @Column()
  secure_url!: string;

  @Column()
  name!: string;

  @Column()
  format!: string;

  @ManyToOne(() => ProductView, (productView) => productView.images, {
    onDelete: 'CASCADE',
  })
  productView!: ProductView;

  @Column({ nullable: true })
  sortOrder!: number;
}
