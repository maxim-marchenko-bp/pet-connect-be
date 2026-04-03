import { Request, Response } from 'express';
import { generatePetInvitation, getPetInviteByToken, invitePetToUserByToken } from "./pet-invite.service";
import { PORT } from "../../common/constants/port";

export const createPetInviteLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { petId } = req.params;
    const token = await generatePetInvitation(+petId, id);
    res.status(200).json({ token, url: `http://localhost:${PORT}/api/pet-invite/${token}` });
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
};

export const getPetInvite = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const invite = await getPetInviteByToken(token);
    res.status(200).json(invite);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
}

export const invitePetToUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const { token } = req.params;
    const inviteResult = await invitePetToUserByToken(id, token);
    res.status(200).json(inviteResult);
  } catch (error) {
    throw new Error((error as { message: string }).message);
  }
};
