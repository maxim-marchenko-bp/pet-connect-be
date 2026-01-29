import { CreatePetTypeDto, UpdatePetTypeDto } from "./pet-type.schema";
import { petTypeRepository } from "./pet-type.repository";

export const createPetType = (dto: CreatePetTypeDto) => {
  const type = petTypeRepository.create(dto);
  return petTypeRepository.save(type);
};

export const updatePetType = (id: number, dto: UpdatePetTypeDto) => {
  return petTypeRepository.update({ id }, dto);
};

export const findAllPetTypesLookups = () => {
  return petTypeRepository
    .createQueryBuilder('petType')
    .select(['petType.code', 'petType.label'])
    .getMany();
};

export const findPetTypeById = (id: number) => {
  return petTypeRepository
    .createQueryBuilder('petType')
    .select(['petType.id', 'petType.code'])
    .where('petType.id = :id', { id })
    .getOne();
};

export const findPetTypeByCode = (code: string) => {
  return petTypeRepository
    .createQueryBuilder('petType')
    .select(['petType.id'])
    .where('petType.code = :code', { code })
    .getOne();
}

export const removePetTypeById = (id: number) => {
  return petTypeRepository.delete({ id });
};
