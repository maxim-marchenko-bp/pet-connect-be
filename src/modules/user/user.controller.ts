import {
  addPetIdsToUser,
  createUser,
  deleteUserById,
  findUserByEmailPublic,
  findUserByIdPublic,
  getAllUsersPublic,
  getPetsIdsByUserId,
  removePetIdsFromUser,
  updateUser
} from "./user.service";
import { CreateUserDto } from "./user.schema";
import { Request, Response } from 'express';

interface AddUserRequest extends Request {
  body: CreateUserDto;
}

interface AssignPetToUserRequest extends Request {
  body: {
    petIds: number[];
  };
}

export const addUser = async (req: AddUserRequest, res: Response) => {
  try {
    const userData = req.body;
    const existingUser = await findUserByEmailPublic(userData.email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await createUser(userData);
    return res.status(201).send(user);
  } catch (error) {
    throw new Error('Unable to create user');
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await updateUser(userId, req.body);
    return res.status(200).send(user);
  } catch (error) {
    throw new Error('Unable to update user');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await findUserByIdPublic(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    throw new Error('Unable to get user');
  }
}

export const deleteUserProfileById = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await findUserByIdPublic(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await deleteUserById(userId);
    return res.status(204).send(`User with id ${userId} deleted successfully`);
  } catch (error) {
    throw new Error('Unable to delete user');
  }
};

export const getAllUserProfiles = async (_: Request, res: Response) => {
  try {
    const users = await getAllUsersPublic();
    return res.status(200).send(users);
  } catch (error) {
    throw new Error('Unable to get users');
  }
};

export const assignPetsToUser = async (req: AssignPetToUserRequest, res: Response) => {
  try {
    const { petIds } = req.body;
    const userId = +req.params.id;
    const petsIds = await getPetsIdsByUserId(userId);
    await removePetIdsFromUser(userId, petsIds);
    const updatedUser = await addPetIdsToUser(userId, petIds);
    res.status(200).send(updatedUser);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const { user } = req as (Request & { user: { id: number } });
  const existingUser = await findUserByIdPublic(user.id);
  if (!existingUser) {
    throw new Error('Invalid credentials');
  }

  res.status(200).json(existingUser);
}

