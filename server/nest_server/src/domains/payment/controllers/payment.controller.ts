import { Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { confirmPaymentSchema } from '../dto/confirm-payment.dto';
import type { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { preparePaymentSchema } from '../dto/prepare-payment.dto';
import type { PreparePaymentDto } from '../dto/prepare-payment.dto';
import { PaymentService } from '../services/payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('prepare')
  prepare(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe(preparePaymentSchema)) dto: PreparePaymentDto,
  ) {
    return this.paymentService.prepare(userId, dto);
  }
  @Post('confirm')
  confirm(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe(confirmPaymentSchema)) dto: ConfirmPaymentDto,
  ) {
    return this.paymentService.confirm(userId, dto);
  }
}
