import { User } from "./user.entity";

export type PublicUserDto = Omit<User, 'password'>;
