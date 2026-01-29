import { userRepository } from "./user.repository";
import { CreateUserDto, UpdateUserDto } from "./user.schema";
import { toPublicUser } from "./user.mapper";
import { User } from "./user.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { PublicUserDto } from "./user.dto";

export const createUser = (dto: CreateUserDto): Promise<User> => {
  const userDto = userRepository.create(dto);
  return userRepository.save(userDto);
};

export const assignPetsToUser = async (userId: number, petIds: number[]) => {
  return await userRepository
    .createQueryBuilder()
    .relation('pets')
    .of(userId)
    .add(petIds);
};

export const updateUser = async (id: number, dto: UpdateUserDto): Promise<UpdateResult> => {
  return userRepository.update({id}, dto);
};

export const findUserByIdPublic = async (id: number): Promise<PublicUserDto | null> => {
  const user = await userRepository.findOneBy({ id });
  if (!user) {
    return null;
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
  const users = await userRepository.find();
  return users.map(toPublicUser);
};
