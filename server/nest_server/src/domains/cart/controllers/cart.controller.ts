import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  createCartItemSchema,
  type CreateCartItemDto,
} from 'src/domains/cart/cart_item/dto/create-cartItem.dto';
import {
  type UpdateCartItemDto,
  updateCartItemSchema,
} from 'src/domains/cart/cart_item/dto/update-cartItem.dto';
import { CartItem } from 'src/domains/cart/cart_item/entity/cartItem.entity';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { CartService } from '../services/cart.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  private readonly cartService: CartService;

  constructor(cartService: CartService) {
    this.cartService = cartService;
  }

  @Post()
  add(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe(createCartItemSchema))
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem[]> {
    return this.cartService.create(userId, createCartItemDto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string): Promise<CartItem[]> {
    return this.cartService.findAll(userId);
  }

  @Patch(':cartItemId')
  update(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
    @Body(new ValidationPipe(updateCartItemSchema))
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.cartService.update(cartItemId, updateCartItemDto);
  }

  @Delete(':cartItemId')
  delete(
    @Param('cartItemId', ParseIntPipe) cartItemId: number,
  ): Promise<string> {
    return this.cartService.delete(cartItemId);
  }
}
