import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from "../../common/entities/base.entity";
import { Pet } from "../pet/pet.entity";
import { Gender } from "./user.model";

@Entity()
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  lastname!: string;

  @Column()
  password!: string;

  @Column({ nullable: true, name: 'date_of_birth', default: null })
  dateOfBirth?: Date;

  @Column({ default: true, name: 'is_active' })
  isActive!: boolean;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE, })
  gender!: Gender;

  @ManyToMany(() => Pet, pet => pet.users)
  @JoinTable({
    name: 'user_pets',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'pet_id', referencedColumnName: 'id' },
  })
  pets!: Pet[];
}
