import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from '../../entity/cart.entity';
import { Product } from '../../../product/entity/product.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('int')
  quantity!: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  cart!: Cart;

  @ManyToOne(() => ProductSpec, (productSpec) => productSpec.cartItems, {
    onDelete: 'CASCADE',
  })
  productSpec!: ProductSpec;
}
