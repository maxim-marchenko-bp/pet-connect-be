import { AppDataSource } from "../../data-source";
import { PetInvite } from "./pet-invite.entity";

export const petInviteRepository = AppDataSource.getRepository(PetInvite);
