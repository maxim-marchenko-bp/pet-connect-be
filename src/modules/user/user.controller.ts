import {
  addNewUser,
  addPetIdsToUser,
  deleteUserById,
  findUserByIdPublic,
  getAllUsersPublic,
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
    const user = await addNewUser(userData);
    res.status(201).send(user);
  } catch (error) {
    throw error;
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
    return res.status(200).send(user);
  } catch (error) {
    throw new Error('Unable to get user');
  }
}

export const deleteUserProfileById = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
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
    await addPetIdsToUser(userId, petIds);
    res.sendStatus(200);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  const { user } = req as (Request & { user: { id: number } });
  const existingUser = await findUserByIdPublic(user.id);

  res.status(200).json(existingUser);
}

