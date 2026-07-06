import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from '../../entity/cart.entity';
import { Product } from '../../../product/entity/product.entity';

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

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  product!: Product;
}
