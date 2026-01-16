import { User } from "./user.entity";
import { PublicUserDto } from "./user.dto";

export const toPublicUser = (user: User): PublicUserDto => {
  const { password, ...safeUserData } = user;
  return safeUserData;
}
