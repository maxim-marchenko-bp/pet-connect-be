import { CreateUserDto } from "../user/user.schema";
import { findUserByEmailInternal, findUserByEmailPublic, saveUser } from "../user/user.service";
import bcrypt from "bcrypt";
import { toPublicUser } from "../user/user.mapper";
import { generateRefreshToken, signAccessToken } from "../../common/auth/token.utils";
import { deleteByToken, saveToken } from "../refresh-token/refresh-token.service";

export const registerUser = async (user: CreateUserDto) => {
  const existingUser = await findUserByEmailPublic(user.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await saveUser({ ...user, password: hashedPassword });
  return toPublicUser(newUser);
};

export const loginByEmailAndPassword = async (email: string, password: string) => {
  const user = await findUserByEmailInternal(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordOk = await bcrypt.compare(password, user.password);
  if (!isPasswordOk) {
    throw new Error('Invalid credentials');
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = generateRefreshToken();
  await saveToken(user.id, refreshToken);

  return { accessToken, refreshToken };
};

export const logoutByRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error('Invalid credentials');
  }

  await deleteByToken(refreshToken);
}
