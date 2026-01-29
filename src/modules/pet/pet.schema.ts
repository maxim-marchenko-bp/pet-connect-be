import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  age: z.number().int().nonnegative().optional(),
});
export const updatePetSchema = createPetSchema.partial();

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
