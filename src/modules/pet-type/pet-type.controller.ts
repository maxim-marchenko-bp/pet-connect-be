import { Request, Response } from 'express';
import {
  createPetType,
  findAllPetTypesLookups,
  findPetTypeById,
  removePetTypeById,
  updatePetType
} from "./pet-type.service";

export const addPetType = async (req: Request, res: Response) => {
  try {
    const newPetType = await createPetType(req.body);
    res.status(201).json(newPetType);
  } catch (error) {
    throw new Error('Unable to add pet type');
  }
};

export const modifyPetType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedPetType = await updatePetType(+id, req.body);
    res.status(200).json(updatedPetType);
  } catch (error) {
    throw new Error('Unable to update pet type');
  }
};

export const getAllPetTypes = async (req: Request, res: Response) => {
  try {
    const petTypes = await findAllPetTypesLookups();
    res.status(200).json(petTypes);
  } catch (error) {
    throw new Error('Unable to fetch pet types');
  }
};

export const getPetTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const petType = await findPetTypeById(+id);
    res.status(200).json(petType);
  } catch (error) {
    throw new Error(`Unable to fetch pet type by ID: ${req.params.id}`);
  }
};

export const deletePetTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await removePetTypeById(+id);
    res.status(204).send(`User with id ${id} deleted successfully`);
  } catch (error) {
    throw new Error(`Unable to delete pet type by ID: ${req.params.id}`);
  }
}

