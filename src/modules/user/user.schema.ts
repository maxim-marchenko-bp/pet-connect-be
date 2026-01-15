import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().optional(),
  email: z.email(),
  age: z.number().optional(),
  password: z.string().min(6),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();
