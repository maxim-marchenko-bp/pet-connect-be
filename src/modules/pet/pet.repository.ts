import { AppDataSource } from "../../data-source";
import { Pet } from "./pet.entity";

export const petRepository = AppDataSource.getRepository(Pet)
