import z from 'zod/v3';

export const createCategorySchema = z
  .object({
    name: z.string().max(10),
  })
  .required();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
