import { Router } from 'express';
import { validate } from "../../common/middleware/validate";
import { createUserSchema, updateUserSchema } from "./user.schema";
import {
  deleteUserProfileById,
  getAllUserProfiles,
  getUserById,
  addUser,
  updateUserInfo
} from "./user.controller";

const router = Router();

router.get('/', getAllUserProfiles);

router.post('/', validate(createUserSchema), addUser);

router.put('/:id', validate(updateUserSchema), updateUserInfo);

router.get('/:id', getUserById);

router.delete('/:id', deleteUserProfileById);

export default router;
