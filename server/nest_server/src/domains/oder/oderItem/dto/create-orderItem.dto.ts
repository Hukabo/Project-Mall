import z from 'zod/v3';

export const createOrderItemSchema = z
  .object({
    quantity: z.number().positive(),
    productId: z.number().positive(),
  })
  .required();

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;
