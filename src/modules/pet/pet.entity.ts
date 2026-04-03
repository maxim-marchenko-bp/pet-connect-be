import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../user/user.entity";
import { PetType } from "../pet-type/pet-type.entity";
import { PetInvite } from "../pet-invite/pet-invite.entity";

@Entity()
export class Pet extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true, name: 'date_of_birth', default: null })
  dateOfBirth?: Date;

  @ManyToOne(() => PetType, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: 'pet_type_id' })
  type!: PetType;

  @ManyToMany(() => User, user => user.pets, { onDelete: 'CASCADE' })
  users!: User[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'modifiedById'})
  modifiedBy!: User | null;

  @OneToMany(() => PetInvite, petInvite => petInvite.pet)
  invites!: PetInvite[];
}
