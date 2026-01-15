import bcrypt from 'bcrypt';
import { signAccessToken } from "../../common/auth/jwt";
import { createUser, findUserByEmail } from "../user/user.service";
import { CreateUserDto } from "../user/user.schema";
import { Request, Response } from 'express';

export const registerNewUser = async (req: Request, res: Response) => {
  const user = req.body as CreateUserDto;
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await createUser({ ...user, password: hashedPassword });
  const { password, ...safeUserData } = newUser;
  res.status(201).json(safeUserData);
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordOk = await bcrypt.compare(password, user.password);
  if (!isPasswordOk) {
    throw new Error('Invalid credentials');
  }

  const accessToken = signAccessToken(user);
  return res.status(200).json({ accessToken });
};
