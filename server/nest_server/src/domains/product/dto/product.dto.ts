import z from 'zod/v3';

export const createProductSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().positive(),
    // category:
  })
  .required();

export type CreateProductDto = z.infer<typeof createProductSchema>;
