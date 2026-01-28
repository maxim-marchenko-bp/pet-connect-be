import { Router } from 'express';
import { getCurrentUser, loginUser, logoutUser, registerNewUser } from "./auth.controller";
import { validate } from "../../common/middleware/validate";
import { createUserSchema } from "../user/user.schema";
import { authenticate } from "../../common/middleware/auth";

const router = Router();

router.post('/register', validate(createUserSchema), registerNewUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', [authenticate], getCurrentUser);

export default router;
