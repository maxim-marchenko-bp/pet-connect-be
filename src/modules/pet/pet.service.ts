import { petRepository } from "./pet.repository";
import { CreatePetDto, UpdatePetDto } from "./pet.schema";
import { Pet } from "./pet.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { findPetTypeByCode } from "../pet-type/pet-type.service";

export const findAllPets = async (): Promise<Pet[]> => {
  return petRepository.find({ relations: ['type'] });
};

export const findPetById = async (id: number): Promise<Pet | null > => {
  return petRepository.findOneBy({ id });
};

export const createPet = async (dto: CreatePetDto): Promise<Pet> => {
  const type = await findPetTypeByCode(dto.type);
  if (!type) {
    throw new Error(`Pet type with code ${dto.type} not found`);
  }
  const petDto = {
    ...dto,
    type,
  };
  const newPet = petRepository.create(petDto);
  return await petRepository.save(newPet);
}

export const updatePet = async (id: number, dto: UpdatePetDto): Promise<UpdateResult> => {
  if (dto.type) {
    const type = await findPetTypeByCode(dto.type);
    if (!type) {
      throw new Error(`Pet type with code ${dto.type} not found`);
    }

    const petDto = {
      ...dto,
      type,
    };
    return petRepository.update({ id }, petDto);
  }

  const { type, ...rest } = dto;
  return petRepository.update({ id }, rest);
};

export const deletePet = async (id: number): Promise<DeleteResult> => {
  return petRepository.delete({ id });
}
