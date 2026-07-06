import z from 'zod/v3';

const toNumber = (val: unknown) => Number(val);

export const createProductSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.preprocess(toNumber, z.number().positive()),
    stock: z.preprocess(toNumber, z.number().positive()),
    categoryId: z.preprocess(toNumber, z.number().positive()),
  })
  .required();

export type CreateProductDto = z.infer<typeof createProductSchema>;
