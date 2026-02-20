import { z } from "zod";

export const createPetSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  dateOfBirth: z.coerce.date().optional(),
});
export const updatePetSchema = createPetSchema.partial();

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
