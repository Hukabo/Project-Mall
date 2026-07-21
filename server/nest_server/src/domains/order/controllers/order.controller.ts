import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderStatus } from 'src/enums/status.enum';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import {
  type CreateOrderItemDto,
  createOrderItemSchema,
} from '../orderItem/dto/create-orderItem.dto';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/domains/user/entity/user.entity';
import {
  createOrderSchema,
  type CreateOrderDto,
} from '../dto/create-order.dto';

@Controller('orders')
export class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Post()
  create(
    @CurrentUser('id') userId: number,
    @Body(new ValidationPipe(createOrderSchema)) createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Get(':orderId')
  find(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.find(orderId);
  }

  @Get('user/:userId')
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.findAll(userId);
  }

  @Patch(':orderId')
  update(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() orderStatus: OrderStatus,
  ) {
    return this.orderService.update(orderId, orderStatus);
  }
}
