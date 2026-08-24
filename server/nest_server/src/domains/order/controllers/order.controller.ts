import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderStatus } from 'src/enums/order-status.enum';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Controller('orders')
export class OrderController {
  private readonly orderService: OrderService;

  constructor(orderService: OrderService) {
    this.orderService = orderService;
  }

  @Get(':orderId')
  find(@Param('orderId') orderId: string) {
    return this.orderService.find(orderId);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.orderService.findAll(userId);
  }

  @Patch(':orderId')
  update(@Param('orderId') orderId: string, @Body() orderStatus: OrderStatus) {
    return this.orderService.update(orderId, orderStatus);
  }
}
