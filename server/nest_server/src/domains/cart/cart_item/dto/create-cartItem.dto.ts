import z from 'zod/v3';

export const createCartItemSchema = z
  .object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
  })
  .required();

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>;
