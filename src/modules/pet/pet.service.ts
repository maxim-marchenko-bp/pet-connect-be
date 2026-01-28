import { petRepository } from "./pet.repository";
import { CreatePetDto, UpdatePetDto } from "./pet.schema";
import { Pet } from "./pet.entity";
import { DeleteResult, UpdateResult } from "typeorm";

export const findAllPets = async (): Promise<Pet[]> => {
  return petRepository.find({});
};

export const findPetById = async (id: number): Promise<Pet | null > => {
  return petRepository.findOneBy({ id });
};

export const createPet = async (pet: CreatePetDto): Promise<Pet> => {
  const newPet = petRepository.create(pet);
  return await petRepository.save(newPet);
}

export const updatePet = async (id: number, pet: UpdatePetDto): Promise<UpdateResult> => {
  return petRepository.update({ id }, pet);
};

export const deletePet = async (id: number): Promise<DeleteResult> => {
  return petRepository.delete({ id });
}
