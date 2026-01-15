import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';
import { User } from "../../modules/user/user.entity";

dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as Secret;

export const signAccessToken = (user: User) => {
  return jwt.sign(
    { id: user.id },
    ACCESS_SECRET,
    { expiresIn: '10min' }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as { id: number };
};


