import {
  createPet,
  deletePet,
  findAllPets,
  findPetById,
  findPets,
  findUsersByPetId,
  updatePet
} from "./pet.service";
import { Request, Response } from 'express';
import { QueryFilterRequest } from "../../common/models/query-filter-request";

export const getAllPets = async (_: Request, res: Response) => {
  try {
    const pets = await findAllPets();
    res.json(pets);
  } catch (error) {
    throw new Error('Unable to get pets');
  }
};

export const getPetsList = async (req: QueryFilterRequest, res: Response) => {
  const filters = req.query;
  try {
    const findResult = await findPets(filters);
    res.status(200).json(findResult);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}

export const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;
    const pet = await findPetById(+id, userId);
    res.json(pet);
  } catch (error) {
    throw error;
  }
};

export const createNewPet = async (req: Request, res: Response) => {
  try {
    const savedPet = await createPet(req.body);
    res.status(201).json(savedPet);
  } catch (error) {
    throw new Error('Unable to create pet');
  }
};

export const updatePetInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedPet = await updatePet(+id, req.body);
    return res.status(200).json(updatedPet);
  } catch (error) {
    throw error;
  }
};

export const deletePetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deletePet(+id);
    res.status(200).send(`Pet with id ${+id} deleted successfully`);
  } catch (error) {
    throw new Error('Unable to delete pet');
  }
}

export const getUsersByPetId = async (req: QueryFilterRequest, res: Response) => {
  const { id } = req.params;
  const filters = req.query;
  try {
    const pets = await findUsersByPetId(+id, filters);
    res.status(200).json(pets);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}
