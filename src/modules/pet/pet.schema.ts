import { z } from "zod";
import { PetType } from "./constants/pet-type.enum";

const petTypeValues = Object.values(PetType);

export const createPetSchema = z.object({
  name: z.string().min(1),
  type: z.enum([...petTypeValues]),
  age: z.number().int().nonnegative().optional(),
});
export const updatePetSchema = createPetSchema.partial();

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
