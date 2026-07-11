import z from 'zod/v3';

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, '카테고리 이름은 최소 1글자 이상이어야 합니다.')
    .max(10, '카테고리 이름은 최대 10글자까지 가능합니다.'),
  parentId: z.nullable(z.coerce.number().optional()),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
