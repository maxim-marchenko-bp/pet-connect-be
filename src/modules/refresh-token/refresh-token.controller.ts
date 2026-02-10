import { Request, Response } from 'express';
import { refreshTokens } from "./refresh-token.service";
import { accessCookieOptions, refreshCookieOptions } from "../../common/cookie/cookie.options";

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const { newAccessToken, newRefreshToken } = await refreshTokens(refreshToken);

  res
    .cookie('accessToken', newAccessToken, accessCookieOptions)
    .cookie('refreshToken', newRefreshToken, refreshCookieOptions)
    .status(200)
    .json({ message: 'OK' });
};
