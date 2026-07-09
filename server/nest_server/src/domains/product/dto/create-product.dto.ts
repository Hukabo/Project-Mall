import z from 'zod/v3';

const toNumber = (val: unknown) => Number(val);

export const createProductSchema = z
  .object({
    name: z.string({ required_error: '상품명을 입력하세요.' }),
    description: z.string(),
    price: z.preprocess(
      toNumber,
      z.number({ required_error: '가격을 입력하세요.' }).positive(),
    ),
    stock: z.preprocess(
      toNumber,
      z.number({ required_error: '재고를 입력하세요.' }).nonnegative(),
    ),
    categoryId: z.preprocess(
      toNumber,
      z.number({ required_error: '카테고리를 입력하세요.' }).positive(),
    ),
  })
  .required();

export type CreateProductDto = z.infer<typeof createProductSchema>;
