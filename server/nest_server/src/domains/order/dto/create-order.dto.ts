import z from 'zod/v3';
import { shippingSchema } from '../shipping/dto/shipping.dto';

export const createOrderSchema = z
  .object({
    orderId: z.string().min(8),
    cartItemIds: z.array(z.number()).min(1),
  })
  .required();

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
