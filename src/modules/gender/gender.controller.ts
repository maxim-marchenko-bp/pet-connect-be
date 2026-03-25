import { Request, Response } from "express";
import { getAllGenders } from "./gender.service";

export const getGenders = async (_: Request, res: Response)=> {
  try {
    const genders = getAllGenders();
    res.status(200).json(genders);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}
