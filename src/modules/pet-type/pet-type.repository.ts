import { AppDataSource } from "../../data-source";
import { PetType } from "./pet-type.entity";

export const petTypeRepository = AppDataSource.getRepository(PetType);
