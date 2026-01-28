import bcrypt from 'bcrypt';
import { generateRefreshToken, signAccessToken } from "../../common/auth/token.utils";
import { createUser, findUserByEmailPublic, findUserByEmailInternal, findUserByIdPublic } from "../user/user.service";
import { CreateUserDto } from "../user/user.schema";
import { Request, Response } from 'express';
import {
  deleteByToken,
  saveToken
} from "../refresh-token/refresh-token.service";
import { accessCookieOptions, refreshCookieOptions } from "../../common/cookie/cookie.options";
import { toPublicUser } from "../user/user.mapper";

interface RegisterNewUserRequest extends Request {
  body: CreateUserDto;
}

export const registerNewUser = async (req: RegisterNewUserRequest, res: Response) => {
  const user = req.body;
  const existingUser = await findUserByEmailPublic(user.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = await createUser({ ...user, password: hashedPassword });
  const publicUser = toPublicUser(newUser);
  res.status(201).json(publicUser);
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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

  res
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .sendStatus(200)
  ;
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new Error('Invalid credentials');
  }

  await deleteByToken(refreshToken);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .sendStatus(200);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const { user } = req as (Request & { user: { id: number } });
  const existingUser = await findUserByIdPublic(user.id);
  if (!existingUser) {
    throw new Error('Invalid credentials');
  }

  res.status(200).json(existingUser);
}
