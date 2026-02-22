import z from 'zod/v3';

export const updateCategorySchema = z.object({
  name: z.string().max(10),
});

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
