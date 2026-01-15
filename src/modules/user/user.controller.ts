import { createUser, deleteUserById, findUserByEmail, findUserById, getAllUsers, updateUser } from "./user.service";
import { createUserSchema } from "./user.schema";
import { Request, Response } from 'express';

export const addUser = async (req: Request, res: Response) => {
  try {
    // TODO check if createUserSchema can be removed since validate middleware is used
    const data = createUserSchema.parse(req.body);
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const user = await createUser(data);
    return res.status(201).send(user);
  } catch (error) {
    return res.status(400).send('Unable to create user');
  }
};

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await updateUser(userId, req.body);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send('Unable to update user');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send('Unable to get user');
  }
}

export const deleteUserProfileById = async (req: Request, res: Response) => {
  try {
    const userId = +req.params.id;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await deleteUserById(userId);
    return res.status(204).send(`User with id ${userId} deleted successfully`);
  } catch (error) {
    return res.status(400).send('Unable to delete user');
  }
};

export const getAllUserProfiles = async (_: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send('Unable to get users');
  }
}
