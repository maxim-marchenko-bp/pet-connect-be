import { Router } from 'express';
import { loginUser, logoutUser, registerNewUser } from "./auth.controller";
import { validate } from "../../common/middleware/validate";
import { createUserSchema } from "../user/user.schema";

const router = Router();

router.post('/register', validate(createUserSchema), registerNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
