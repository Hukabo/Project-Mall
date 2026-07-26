import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartItemDto } from 'src/domains/cart/cart_item/dto/create-cartItem.dto';
import { UpdateCartItemDto } from 'src/domains/cart/cart_item/dto/update-cartItem.dto';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { InternalServerError } from 'src/errors/internal-server.error';
import { Repository } from 'typeorm';
import { Cart } from '../entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: {
          cart: {
            cartItems: {
              product: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('the user is not exists...');
      }
      const cart = user.cart;

      const { productId, quantity } = createCartItemDto;

      const product = await this.productRepository.findOneBy({ id: productId });

      if (!product) {
        throw new NotFoundException('해당 상품이 없습니다.');
      }

      // 해당 상품이 이미 장바구니에 있다면 수량 증가
      const existingItem = cart.cartItems.find(
        (item) => item.product.id === productId,
      );

      if (existingItem) {
        return await this.update(existingItem.id, {
          quantity: existingItem.quantity + quantity,
        });
      }

      const cartItem = this.cartItemRepository.create({
        quantity,
        cart,
        product,
      });

      return await this.cartItemRepository.save(cartItem);
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while creating the cart item...',
        error,
      );
    }
  }

  async findAll(cartId: number): Promise<CartItem[]> {
    try {
      const cart = await this.cartRepository.findOneBy({ id: cartId });

      if (!cart) {
        throw new NotFoundException('the cart is not exists...');
      }

      return await this.cartItemRepository.find({
        where: { cart },
        relations: {
          product: true,
        },
        select: {
          id: true,
          quantity: true,
          product: {
            id: true,
            name: true,
            price: true,
            description: true,
            stock: true,
          },
        },
      });
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while finding All cart items...',
      );
    }
  }

  async update(
    cartItemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    try {
      const { quantity } = updateCartItemDto;

      await this.cartItemRepository.update(cartItemId, {
        quantity,
      });

      const item = await this.cartItemRepository.findOne({
        where: {
          id: cartItemId,
        },
        relations: {
          product: true,
        },
        select: {
          id: true,
          quantity: true,
          product: {
            name: true,
            description: true,
          },
        },
      });

      if (!item) {
        throw new NotFoundException('the cart item is not exists...');
      }

      return item;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'something went wrong while updating the cart item...',
        error,
      );
    }
  }

  async delete(cartItemId: number): Promise<string> {
    try {
      const res = await this.cartItemRepository.delete({ id: cartItemId });

      if (!res.affected) {
        throw new NotFoundException('the item is not exists...');
      }

      return 'the item was deleted successfully';
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while deleting the cart item...',
      );
    }
  }
}
