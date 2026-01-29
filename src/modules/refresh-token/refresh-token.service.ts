import { refreshTokenRepository } from "./refresh-token.repository";
import { generateRefreshToken, hashToken, signAccessToken } from "../../common/auth/token.utils";
import { RefreshToken } from "./refresh-token.entity";
import { DeleteResult } from "typeorm";
import { findUserByIdPublic } from "../user/user.service";
import { Unauthorized } from "http-errors";

const refreshRepo = refreshTokenRepository;

export const saveToken = (userId: number, token: string): Promise<RefreshToken> => {
  const refreshToken = refreshRepo.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return refreshRepo.save(refreshToken);
};

export const findByToken = (token: string): Promise<RefreshToken | null> => {
  return refreshRepo.findOneBy({  tokenHash: hashToken(token) })
};

export const deleteTokenById = async (id: number): Promise<DeleteResult> => {
  return refreshRepo.delete({ id });
};

export const deleteByToken = async (token: string): Promise<DeleteResult> => {
  return refreshRepo.delete({ tokenHash: hashToken(token) });
};

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Unauthorized();
  }

  const storedRefreshToken = await findByToken(refreshToken);
  if (!storedRefreshToken || (storedRefreshToken.expiresAt < new Date())) {
    throw new Unauthorized();
  }

  const user = await findUserByIdPublic(storedRefreshToken.userId);
  if (!user) {
    throw new Unauthorized();
  }

  await deleteTokenById(storedRefreshToken.id);
  const newRefreshToken = generateRefreshToken();
  const newAccessToken = signAccessToken(user.id);
  await saveToken(user.id, newRefreshToken);

  return { newAccessToken, newRefreshToken };
}
