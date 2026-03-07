import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderStatus } from 'src/enums/status.enum';

@Controller('orders')
export class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Post(':userId')
  create(@Param('userId', ParseIntPipe) userId: number) {
    return this.orderService.create(userId);
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
