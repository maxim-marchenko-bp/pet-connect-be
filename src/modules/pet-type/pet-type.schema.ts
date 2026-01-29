import { z } from 'zod';

export const createPetTypeSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
});
export const updatePetTypeSchema = createPetTypeSchema.partial();

export type CreatePetTypeDto = z.infer<typeof createPetTypeSchema>;
export type UpdatePetTypeDto = z.infer<typeof updatePetTypeSchema>;
