import z from 'zod/v3';

const isNumber = (value: unknown) => Number(value);

export const createOrderItemSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    price: z.preprocess(isNumber, z.number()),
    quantity: z
      .number({ message: '주문 상품 수량은 숫자여야합니다.' })
      .positive({ message: '주문 상품 수량은 1개 이상이어야합니다.' }),
    productId: z
      .number({ message: '주문 상품 id는 숫자여야합니다.' })
      .positive({ message: '주문 상품 id는 정수여야합니다.' }),
    // TODO: 이미지 추가
  })
  .required();

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;
