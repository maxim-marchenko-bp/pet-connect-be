import { Router } from "express";
import { getGenders } from "./gender.controller";

const router = Router();

router.get('/', getGenders);

export default router;
