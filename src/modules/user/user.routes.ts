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
import { authenticate } from "../../common/middleware/auth";

const router = Router();

router.get('/', [authenticate], getAllUserProfiles);

router.post('/', [authenticate], validate(createUserSchema), addUser);

router.put('/:id', [authenticate], validate(updateUserSchema), updateUserInfo);

router.get('/:id', [authenticate], getUserById);

router.delete('/:id', [authenticate], deleteUserProfileById);

export default router;
