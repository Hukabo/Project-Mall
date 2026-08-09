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
import { CurrentUser } from 'src/decorators/current-user.decorator';
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
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe(createOrderSchema)) createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(userId, createOrderDto);
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
