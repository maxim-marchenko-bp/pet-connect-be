import { AppDataSource } from "../../data-source";
import { User } from "./user.entity";

export const userRepository = AppDataSource.getRepository(User);
