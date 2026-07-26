import { Cart } from 'src/domains/cart/entity/cart.entity';
import { Order } from 'src/domains/order/entity/order.entity';
import { Role } from 'src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  username!: string;

  @Column()
  birth!: string;

  @Column()
  address!: string;

  @Column()
  phone!: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles!: Role[];

  @Column({ nullable: true })
  hashedRefreshToken!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
  })
  @JoinColumn() // <--- which indicates that this side of the relationship will own the relationship.
  cart!: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
