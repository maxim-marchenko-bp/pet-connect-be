import { Request, Response } from 'express';
import { CreateUserDto } from "../user/user.schema";
import { accessCookieOptions, refreshCookieOptions } from "../../common/cookie/cookie.options";
import { loginByEmailAndPassword, logoutByRefreshToken, registerUser } from "./auth.service";

interface RegisterNewUserRequest extends Request {
  body: CreateUserDto;
}

export const registerNewUser = async (req: RegisterNewUserRequest, res: Response) => {
  const user = req.body;
  const publicUser = await registerUser(user);
  res.status(201).json(publicUser);
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { accessToken, refreshToken } = await loginByEmailAndPassword(email, password);

  res
    .cookie('accessToken', accessToken, accessCookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .sendStatus(200)
  ;
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  await logoutByRefreshToken(refreshToken);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .sendStatus(200);
};
