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
  assignPetsToUser
} from "./user.controller";

const router = Router();

router.get('/', getAllUserProfiles);

router.get('/me', getCurrentUser);

router.post('/', validate(createUserSchema), addUser);

router.put('/:id', validate(updateUserSchema), updateUserInfo);

router.get('/:id', getUserById);

router.post('/:id/pets', assignPetsToUser);

router.delete('/:id', deleteUserProfileById);

export default router;
