import { z } from 'zod';
import { Gender } from './user.model';

const genderValues = Object.values(Gender);

export const createUserSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().optional(),
  email: z.email(),
  password: z.string().min(6),
  dateOfBirth: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
  gender: z.enum(genderValues),
});
export const updateUserSchema = createUserSchema.partial();

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
