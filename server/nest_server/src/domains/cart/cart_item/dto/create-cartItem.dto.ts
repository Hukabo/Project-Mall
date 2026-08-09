import { toNumber } from 'src/domains/product/dto/create-product.dto';
import z from 'zod/v3';

export const createCartItemSchema = z
  .object({
    cartItems: z
      .array(
        z.object({
          id: z.preprocess(toNumber, z.number().positive()),
          quantity: z.preprocess(toNumber, z.number().positive()),
        }),
      )
      .min(1),
  })
  .required();

export type CreateCartItemDto = z.infer<typeof createCartItemSchema>;
