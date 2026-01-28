import { Router } from "express";
import { createNewPet, deletePetById, getPetById, getPetsList, updatePetInfo } from "./pet.controller";
import { validate } from "../../common/middleware/validate";
import { updatePetSchema, createPetSchema } from "./pet.schema";

const router = Router();

router.get('/', getPetsList);

router.post('/', validate(createPetSchema), createNewPet);

router.put('/:id', validate(updatePetSchema), updatePetInfo);

router.get('/:id', getPetById);

router.delete('/:id', deletePetById);

export default router;
