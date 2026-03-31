import { z } from "zod";
import { updateUserSchema } from "../user/user.schema";


export const createPetSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  dateOfBirth: z.coerce.date().optional(),
  modifiedById: z.number().optional(),
  users: z.array(updateUserSchema).optional(),
});
export const updatePetSchema = createPetSchema.partial();

export type CreatePetDto = z.infer<typeof createPetSchema>;
export type UpdatePetDto = z.infer<typeof updatePetSchema>;
export type PetDto = CreatePetDto & { canEdit?: boolean, id?: number };
