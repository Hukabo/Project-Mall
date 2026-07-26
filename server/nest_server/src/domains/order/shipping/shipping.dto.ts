import z from 'zod/v3';

export const shippingSchema = z.object({
  name: z
    .string({ required_error: '수령자 이름은 문자여야 합니다.' })
    .min(1, '수령자 이름이 누락되었습니다.'),
  phone: z
    .string()
    .regex(
      /^01[0-9]-?\d{3,4}-?\d{4}$/,
      '옮바른 형식의 전화번호가 아닙니다. 예) 010-1234-1234, 010-123-1234',
    ),
  zipcode: z.preprocess((value: unknown) => Number(value), z.number(), {
    required_error: '잘못된 우편번호 입니다.',
  }),
  address: z.string({ required_error: '배송지가 옮바르지 않습니다.' }),
  addressDetail: z.string({
    required_error: '상세주소가 옮바르지 않습니다.',
  }),
  memo: z.string(),
});

export type ShippingDto = z.infer<typeof shippingSchema>;
