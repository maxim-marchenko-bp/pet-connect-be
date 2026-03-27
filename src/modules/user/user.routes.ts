import { Router } from 'express';
import { validate } from "../../common/middleware/validate";
import { createUserSchema, updateUserSchema } from "./user.schema";
import {
  deleteUserProfileById,
  getAllUserProfiles,
  getUserById,
  addUser,
  updateUserInfo,
  getCurrentUser,
  assignPetsToUser,
  getUserProfilesList,
  getPetsByUserId,
  changeUserPassword,
  addPetsToUser,
  removePetsFromUser,
  joinPetById,
} from "./user.controller";

const router = Router();

router.get('/', getAllUserProfiles);

router.get('/list', getUserProfilesList)

router.get('/me', getCurrentUser);

router.post('/me/change-password', changeUserPassword);

router.get('/join-pet', joinPetById);

router.post('/', validate(createUserSchema), addUser);

router.put('/:id', validate(updateUserSchema), updateUserInfo);

router.get('/:id', getUserById);

router.post('/:id/assign-pets', assignPetsToUser);

router.post('/:id/add-pets', addPetsToUser);

router.post('/:id/remove-pets', removePetsFromUser);

router.get('/:id/pets/list', getPetsByUserId);

router.delete('/:id', deleteUserProfileById);

export default router;
