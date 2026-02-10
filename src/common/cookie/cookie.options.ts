import { CookieOptions } from "express";

export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000,
};

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
