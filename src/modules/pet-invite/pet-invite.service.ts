import crypto from "crypto";
import { petInviteRepository } from "./pet-invite.repository";
import { addPetIdsToUser } from "../user/user.service";
import { hashToken } from "../../common/auth/token.utils";

export const generatePetInvitation = async (petId: number, userId: number) => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Link expires in 24 hours
  const petInvite = petInviteRepository.create({
    tokenHash,
    createdBy: userId,
    expiresAt,
    used: false,
    pet: { id: petId },
  });

  await petInviteRepository.save(petInvite);
  return token;
};

export const getPetInviteByToken = async (token: string) => {
  return petInviteRepository
    .createQueryBuilder('pi')
    .leftJoin('pi.pet', 'pet')
    .select('pi')
    .addSelect(['pet.id', 'pet.name'])
    .where('pi.tokenHash =:token', { token: hashToken(token) })
    .getOne();
}

export const invitePetToUserByToken = async (userId: number, invitationToken: string) => {
  const petInvite = await petInviteRepository
    .createQueryBuilder('pi')
    .leftJoin('pi.pet', 'pet')
    .select('pi')
    .addSelect(['pet.id'])
    .where('pi.tokenHash = :token', { token: hashToken(invitationToken) })
    .getOne();

  if (!petInvite) {
    throw Error('No invitation found.');
  }

  if ((petInvite.expiresAt < new Date()) || petInvite.used) {
    throw Error('Invitation link is already used or expired.');
  }

  await addPetIdsToUser(userId, [petInvite.pet.id]);
  petInvite.used = true;
  await petInviteRepository.save(petInvite);

  return petInvite;
}
