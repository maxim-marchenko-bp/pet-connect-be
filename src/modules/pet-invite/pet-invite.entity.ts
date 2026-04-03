import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { Pet } from "../pet/pet.entity";

@Entity()
export class PetInvite extends BaseEntity {
  @Column({ name: 'token_hash' })
  tokenHash!: string;

  @Column({ name: 'created_by' })
  createdBy!: number;

  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column()
  used!: boolean;

  @ManyToOne(() => Pet, pet => pet.invites)
  @JoinColumn({ name: 'pet_id' })
  pet!: Pet;
}
