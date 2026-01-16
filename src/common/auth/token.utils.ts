import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
import crypto from "crypto";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as Secret;

export const signAccessToken = (userId: number) => {
  return jwt.sign(
    { id: userId },
    ACCESS_SECRET,
    { expiresIn: '15min' }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as { id: number };
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashToken = (token: string) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};
