import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
  dateOfBirth: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});
export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
