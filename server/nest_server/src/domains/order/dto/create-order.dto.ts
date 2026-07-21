import { PaymentMethod } from 'src/enums/payment.enum';
import z from 'zod/v3';

export const createOrderSchema = z
  .object({
    cartItemIds: z.array(z.number()),
    shipping: z.object({
      name: z.string(),
      phone: z.string(),
      zipcode: z.number(),
      address: z.string(),
      addressDetail: z.string(),
      memo: z.string(),
    }),
    payment: z.nativeEnum(PaymentMethod, {
      message: '결제 수단이 누락되었습니다.',
    }),
  })
  .required();

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
