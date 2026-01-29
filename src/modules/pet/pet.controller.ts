import { createPet, deletePet, findAllPets, findPetById, updatePet } from "./pet.service";
import { Request, Response } from 'express';

export const getPetsList = async (_: Request, res: Response) => {
  try {
    const pets = await findAllPets();
    res.json(pets);
  } catch (error) {
    throw new Error('Unable to get pets');
  }
};

export const getPetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pet = await findPetById(+id);
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
