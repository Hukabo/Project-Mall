import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateCartItemDto } from 'src/domains/cart/cart_item/dto/create-cartItem.dto';
import { UpdateCartItemDto } from 'src/domains/cart/cart_item/dto/update-cartItem.dto';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { Product } from 'src/domains/product/entity/product.entity';
import { User } from 'src/domains/user/entity/user.entity';
import { InternalServerError } from 'src/errors/internal-server.error';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../entity/cart.entity';
import { ProductSpec } from 'src/domains/product/entity/productSpec.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,

    @InjectRepository(ProductSpec)
    private readonly productSpecRepository: Repository<ProductSpec>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createCartItemDto: CreateCartItemDto,
  ): Promise<number[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: {
          cart: {
            cartItems: {
              productSpec: true,
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('the user is not exists...');
      }
      const cart = user.cart;

      const { cartItems } = createCartItemDto;

      for (const item of cartItems) {
        const spec = await queryRunner.manager.findOne(ProductSpec, {
          where: {
            id: item.id,
          },
        });

        if (!spec) {
          throw new NotFoundException('해당 상품을 찾을 수 없습니다.');
        }

        // 해당 상품이 이미 장바구니에 있다면 수량 증가
        const existingItem = cart.cartItems.find(
          (exItem) => exItem.productSpec.id === spec.id,
        );

        if (existingItem) {
          existingItem.quantity += item.quantity;

          await queryRunner.manager.save(existingItem);
        } else {
          // 새로운 담기는 상품이라면
          await queryRunner.manager.save(CartItem, {
            quantity: item.quantity,
            cart,
            productSpec: spec,
          });
        }
      }
      await queryRunner.commitTransaction();

      const savedCart = await queryRunner.manager.findOne(Cart, {
        where: {
          id: user.cart.id,
        },
        relations: {
          cartItems: true,
        },
      });

      if (!savedCart) {
        throw new NotFoundException();
      }
      const cartItemIds = savedCart.cartItems.map((item) => item.id);

      return cartItemIds;
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerError(
        'Something went wrong while creating the cart item...',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string): Promise<CartItem[]> {
    try {
      const cart = await this.cartRepository.findOneBy({
        user: { id: userId },
      });

      if (!cart) {
        throw new NotFoundException('the cart is not exists...');
      }

      return await this.cartItemRepository.find({
        where: { cart },
        relations: {
          productSpec: {
            productView: {
              images: true,
              product: true,
            },
          },
        },
        select: {
          id: true,
          quantity: true,
          productSpec: {
            id: true,
            size: true,
            stock: true,
            productView: {
              images: true,
              color: true,
              product: {
                name: true,
                price: true,
              },
            },
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
        select: {
          id: true,
          quantity: true,
          productSpec: {
            size: true,
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
