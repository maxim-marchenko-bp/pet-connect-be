import { Router } from 'express';
import { loginUser, registerNewUser } from "./auth.controller";
import { validate } from "../../common/middleware/validate";
import { createUserSchema } from "../user/user.schema";

const router = Router();

router.post('/register', validate(createUserSchema), registerNewUser);
router.post('/login', loginUser);

export default router;
