import { Router } from "express";
import { createPetInviteLink, getPetInvite, invitePetToUser } from "./pet-invite.controller";

const router = Router();

router.post('/pets/:petId/invites', createPetInviteLink);
router.get('/:token', getPetInvite);
router.get('/:token/accept', invitePetToUser);

export default router;
