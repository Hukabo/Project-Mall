import z from 'zod/v3';

export const concurrencySchema = z
  .object({
    productSpecId: z.preprocess(
      (value: unknown) => Number(value),
      z.number({ required_error: '상품 아이디가 누락되었습니다.' }).positive(),
    ),
    quantity: z.preprocess(
      (value: unknown) => Number(value),
      z.number({ required_error: '주문 수량이 누락되었습니다.' }).positive(),
    ),
  })
  .required();

export type ConcurrencyDto = z.infer<typeof concurrencySchema>;
