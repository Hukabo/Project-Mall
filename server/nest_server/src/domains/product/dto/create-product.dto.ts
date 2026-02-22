import z from 'zod/v3';

export const createProductSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().positive(),
    categoryId: z.number().positive(),
  })
  .required();

export type CreateProductDto = z.infer<typeof createProductSchema>;
