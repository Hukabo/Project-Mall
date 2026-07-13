import z from 'zod/v3';

export const updateProductSchema = z.object({
  name: z
    .string()
    .max(30, { message: '상품 이름은 최대 30자까지 가능합니다.' }),
  description: z.string(),
  price: z.number().positive(),
  stock: z.number().positive(),
  categoryId: z.number().positive(),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
