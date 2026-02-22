import z from 'zod/v3';

export const updateCartItemSchema = z
  .object({
    quantity: z.number().positive(),
  })
  .required();

export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
