import { PaymentMethod } from 'src/enums/payment.enum';
import z from 'zod/v3';
import { shippingSchema } from '../shipping/shipping.dto';

export const createOrderSchema = z
  .object({
    orderId: z.string().min(8).max(24),
    cartItemIds: z.array(z.number()),
  })
  .required();

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
