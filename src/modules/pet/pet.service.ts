import { petRepository } from "./pet.repository";
import { CreatePetDto, UpdatePetDto } from "./pet.schema";
import { Pet } from "./pet.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { findPetTypeByCode } from "../pet-type/pet-type.service";
import { NotFound } from "http-errors";
import { ListFilterParams } from "../../common/models/list-filter-params";
import { FilteredResponse } from "../../common/models/filtered-response";
import { normalizeFilters } from "../../common/utils/normalize-filters";
import { listQueryBuilder } from "../../common/utils/list-query-builder";
import { userRepository } from "../user/user.repository";

export const findAllPets = async (): Promise<Pet[]> => {
  return petRepository.find({ relations: ['type'] });
};

export const findPetById = async (id: number): Promise<Pet | null > => {
  const pet = await petRepository
    .createQueryBuilder('pet')
    .leftJoin('pet.type', 'type')
    .select(['pet', 'type.code', 'type.label'])
    .where('pet.id = :id', { id })
    .getOne();
  if (!pet) {
    throw NotFound('Pet not found' );
  }

  return pet;
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
};

export const updatePet = async (id: number, dto: UpdatePetDto): Promise<UpdateResult> => {
  const existingPet = await findPetById(+id);
  if (!existingPet) {
    throw new NotFound('Pet not found');
  }

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
};

export const findPets = async (filters: ListFilterParams): Promise<FilteredResponse<Pet>> => {
  const normalizedFilters = normalizeFilters(filters);
  const queryBuilder = petRepository
    .createQueryBuilder('pet')
    .leftJoin('pet.type', 'type')
    .select('pet')
    .addSelect(['type.code', 'type.label']);
  const extendedQueryBuilder = listQueryBuilder(queryBuilder, normalizedFilters, 'pet', ['name']);
  const [items, totalCount] = await extendedQueryBuilder.getManyAndCount();

  return { items, totalCount };
};

export const findUsersByPetId = async (petId: number, filters: ListFilterParams) => {
  const normalizedFilters = normalizeFilters(filters);

  const queryBuilder = userRepository
    .createQueryBuilder('user')
    .leftJoin('user.pets', 'pet')
    .where('pet.id = :petId', { petId });
  const extendedQueryBuilder = listQueryBuilder(queryBuilder, normalizedFilters, 'user', ['name']);
  const [items, totalCount] = await extendedQueryBuilder.getManyAndCount();

  return { items, totalCount };
};
