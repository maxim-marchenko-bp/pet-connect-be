import { Router } from 'express';
import { refreshToken } from "./refresh-token.controller";

const router = Router();

router.post('/refresh', refreshToken);

export default router;
