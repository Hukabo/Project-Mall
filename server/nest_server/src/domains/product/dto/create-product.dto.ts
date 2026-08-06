import { Size } from 'src/enums/size.enum';
import z from 'zod/v3';

const toNumber = (val: unknown) => Number(val);

export const createProductSchema = z
  .object({
    name: z.string({ required_error: '상품명을 입력하세요.' }).min(1).max(30),
    description: z.string(),
    price: z.preprocess(
      toNumber,
      z.number({ required_error: '가격을 입력하세요.' }).positive(),
    ),
    variants: z.preprocess(
      (value) => {
        if (typeof value === 'string') return JSON.parse(value);
      },
      z
        .array(
          z.object({
            color: z.string().nullable().optional(),
            sizeStocks: z.array(
              z.object({
                size: z.nativeEnum(Size),
                stock: z.preprocess(toNumber, z.number()),
              }),
            ),
          }),
        )
        .min(1, '최소 하나 이상의 색상(혹은 사이즈 목록)이 있어야합니다.'),
    ),
    categoryId: z.preprocess(
      toNumber,
      z.number({ required_error: '카테고리를 입력하세요.' }).positive(),
    ),
    imagesInfo: z.preprocess(
      (value) => (Array.isArray(value) ? value : [value]),
      z.array(z.preprocess(toNumber, z.number())),
    ),
  })
  .required();

export type CreateProductDto = z.infer<typeof createProductSchema>;
