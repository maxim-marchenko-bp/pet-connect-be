import { User } from "./user.entity";
import { userRepository } from "./user.repository";
import { CreateUserDto } from "./user.schema";

export const createUser = (dto: CreateUserDto) => {
  const userDto = userRepository.create(dto);
  return userRepository.save(userDto);
};

export const updateUser = async (id: number, dto: Partial<User>) => {
  return userRepository.update({id}, dto);
};

export const findUserById = (id: number) => {
  return userRepository.findOneBy({ id });
};

export const findUserByEmail = (email: string) => {
  return userRepository.findOneBy({ email });
};

export const deleteUserById = (id: number) => {
  return userRepository.delete(id);
};

export const getAllUsers = () => {
  return userRepository.find();
}
