import { Request, Response } from 'express';
import {
  deleteTokenById,
  findByToken,
  saveToken
} from "./refresh-token.service";
import { findUserByIdPublic } from "../user/user.service";
import { generateRefreshToken, signAccessToken } from "../../common/auth/token.utils";
import { accessCookieOptions, refreshCookieOptions } from "../../common/cookie/cookie.options";

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const storedRefreshToken = await findByToken(refreshToken);
  if (!storedRefreshToken || (storedRefreshToken.expiresAt < new Date())) {
    return res.sendStatus(401);
  }

  const user = await findUserByIdPublic(storedRefreshToken.userId);
  if (!user) {
    return res.sendStatus(401);
  }

  await deleteTokenById(storedRefreshToken.id);
  const newRefreshToken = generateRefreshToken();
  const newAccessToken = signAccessToken(user.id);
  await saveToken(user.id, newRefreshToken);

  res
    .cookie('accessToken', newAccessToken, accessCookieOptions)
    .cookie('refreshToken', newRefreshToken, refreshCookieOptions)
    .sendStatus(200);
};
