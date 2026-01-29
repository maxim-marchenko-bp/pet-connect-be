import { Router } from "express";
import { addPetType, deletePetTypeById, getAllPetTypes, getPetTypeById, modifyPetType } from "./pet-type.controller";
import { validate } from "../../common/middleware/validate";
import { createPetTypeSchema, updatePetTypeSchema } from "./pet-type.schema";

const router = Router();

router.post('/', validate(createPetTypeSchema), addPetType);

router.put('/:id', validate(updatePetTypeSchema), modifyPetType);

router.get('/', getAllPetTypes);

router.get('/:id', getPetTypeById);

router.delete('/:id', deletePetTypeById);

export default router;
