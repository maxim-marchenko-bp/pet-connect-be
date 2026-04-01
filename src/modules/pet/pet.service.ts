import { petRepository } from "./pet.repository";
import { CreatePetDto, PetDto, UpdatePetDto } from "./pet.schema";
import { Pet } from "./pet.entity";
import { DeleteResult } from "typeorm";
import { findPetTypeByCode } from "../pet-type/pet-type.service";
import { NotFound } from "http-errors";
import { ListFilterParams } from "../../common/models/list-filter-params";
import { FilteredResponse } from "../../common/models/filtered-response";
import { normalizeFilters } from "../../common/utils/normalize-filters";
import { paginatedSearch } from "../../common/utils/paginated-search";
import { userRepository } from "../user/user.repository";
import { PetListFilterParams } from "./pet.model";
import { applyCustomFilters } from "../../common/utils/apply-custom-filters";

export const findAllPets = async (): Promise<Pet[]> => {
  return petRepository.find({ relations: ['type'] });
};

export const findPetById = async (id: number, userId?: number): Promise<PetDto | null > => {
  const qb = petRepository
    .createQueryBuilder('pet')
    .leftJoin('pet.type', 'type')
    .leftJoin('pet.modifiedBy', 'md')
    .select(['pet', 'type.code', 'type.label', 'md.id', 'md.name', 'md.lastname', 'md.email'])
    .where('pet.id = :id', { id });

  if (userId) {
    qb
      .addSelect(`
        EXISTS
        (
          SELECT 1
          FROM user_pets up
          WHERE up.pet_id = pet.id
          AND up.user_id = :userId
        )
      `,
        'canEdit')
      .setParameter('userId', userId);
  }

  const { entities, raw } = await qb.getRawAndEntities();
  const pet = entities[0];
  const canEdit = raw[0].canEdit;
  if (!pet) {
    throw NotFound('Pet not found' );
  }

  return {
    ...pet,
    canEdit,
  } as unknown as PetDto;
};

export const createPet = async (dto: CreatePetDto, userId: number | undefined = undefined): Promise<Pet> => {
  const type = await findPetTypeByCode(dto.type);
  if (!type) {
    throw new Error(`Pet type with code ${dto.type} not found`);
  }
  const petDto = {
    ...dto,
    type,
    modifiedBy: { id: userId },
  };
  const newPet = petRepository.create(petDto);
  return await petRepository.save(newPet);
};

export const updatePet = async (id: number, dto: UpdatePetDto, userId: number | undefined = undefined): Promise<Pet> => {
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
      id: existingPet.id,
      type,
      modifiedBy: { id: userId },
    };

    return petRepository.save(petDto);
  }

  const { type, ...rest } = dto;
  return petRepository.save({ ...rest, id: existingPet.id, modifiedBy: { id: userId } });
};

export const deletePet = async (id: number): Promise<DeleteResult> => {
  return petRepository.delete({ id });
};

export const findPets = async (filters: PetListFilterParams): Promise<FilteredResponse<Pet>> => {
  const normalizedFilters = normalizeFilters(filters);
  const queryBuilder = petRepository
    .createQueryBuilder('pet')
    .leftJoin('pet.type', 'type')
    .select('pet')
    .addSelect(['type.code', 'type.label']);

  const extendedQueryBuilder = paginatedSearch(queryBuilder, normalizedFilters, 'pet', ['name']);

  const filterConfig = {
    type: 'type.code',
    dateOfBirth: 'pet.dateOfBirth',
  };

  applyCustomFilters(extendedQueryBuilder, filters, filterConfig);

  const [items, totalCount] = await extendedQueryBuilder.getManyAndCount();

  return { items, totalCount };
};

export const findUsersByPetId = async (petId: number, filters: ListFilterParams) => {
  const normalizedFilters = normalizeFilters(filters);

  const queryBuilder = userRepository
    .createQueryBuilder('user')
    .leftJoin('user.pets', 'pet')
    .where('pet.id = :petId', { petId });
  const extendedQueryBuilder = paginatedSearch(queryBuilder, normalizedFilters, 'user', ['name']);
  const [items, totalCount] = await extendedQueryBuilder.getManyAndCount();

  return { items, totalCount };
};
