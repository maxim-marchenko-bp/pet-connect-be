import { Router } from "express";
import { createNewPet, deletePetById, getPetById, getAllPets, updatePetInfo, getPetsList } from "./pet.controller";
import { validate } from "../../common/middleware/validate";
import { updatePetSchema, createPetSchema } from "./pet.schema";

const router = Router();

router.get('/', getAllPets);

router.get('/list', getPetsList);

router.post('/', validate(createPetSchema), createNewPet);

router.put('/:id', validate(updatePetSchema), updatePetInfo);

router.get('/:id', getPetById);

router.delete('/:id', deletePetById);

export default router;
