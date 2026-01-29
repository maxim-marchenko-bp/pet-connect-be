import { userRepository } from "./user.repository";
import { CreateUserDto, UpdateUserDto } from "./user.schema";
import { toPublicUser } from "./user.mapper";
import { User } from "./user.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { PublicUserDto } from "./user.dto";
import { Conflict, NotFound } from "http-errors";

export const saveUser = (dto: CreateUserDto): Promise<User> => {
  const userDto = userRepository.create(dto);
  return userRepository.save(userDto);
};

export const addPetIdsToUser = async (userId: number, petIds: number[]): Promise<void> => {
  const petsIds = await getPetsIdsByUserId(userId);
  await removePetIdsFromUser(userId, petsIds);

  return await userRepository
    .createQueryBuilder()
    .relation('pets')
    .of(userId)
    .add(petIds);
};

export const removePetIdsFromUser = async (userId: number, petIds: number[]): Promise<void> => {
  return await userRepository
    .createQueryBuilder()
    .relation('pets')
    .of(userId)
    .remove(petIds);
};

export const getPetsIdsByUserId = async (userId: number): Promise<number[]> => {
  const pets = await userRepository
    .createQueryBuilder("user")
    .leftJoin("user.pets", "pet")
    .where("user.id = :userId", { userId })
    .select('pet.id', 'petId')
    .getRawMany<{ petId: number }>();

  return pets.map(p => p.petId);
}

export const updateUser = async (id: number, dto: UpdateUserDto): Promise<UpdateResult> => {
  return userRepository.update({id}, dto);
};

export const findUserByIdPublic = async (id: number): Promise<PublicUserDto | null> => {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    throw new NotFound("User not found" );
  }

  return toPublicUser(user);
};

export const findUserByEmailPublic = async (email: string): Promise<PublicUserDto | null> => {
  const user = await userRepository.findOneBy({ email });
  if (!user) {
    return null;
  }

  return toPublicUser(user);
};

export const findUserByEmailInternal = (email: string): Promise<User | null> => {
  return userRepository.findOneBy({ email });
}

export const deleteUserById = (id: number): Promise<DeleteResult> => {
  return userRepository.delete(id);
};

export const getAllUsersPublic = async (): Promise<PublicUserDto[]> => {
  const users = await userRepository.find({ relations: ['pets'] });
  return users.map(toPublicUser);
};

export const addNewUser = async (dto: CreateUserDto) => {
  const existingUser = await findUserByEmailPublic(dto.email);
  if (existingUser) {
    throw new Conflict('Email already in use');
  }

  return await saveUser(dto);
}
