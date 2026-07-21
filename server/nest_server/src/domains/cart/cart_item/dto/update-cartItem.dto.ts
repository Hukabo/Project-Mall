import z from 'zod/v3';

const toNumber = (val: unknown) => Number(val);

export const updateCartItemSchema = z
  .object({
    quantity: z.preprocess(
      toNumber,
      z.number({ required_error: '상품 수량을 입력해주세요' }).positive(),
    ),
  })
  .required();

export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
