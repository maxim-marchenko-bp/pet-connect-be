import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from "../../common/entities/base.entity";
import { PetEntity } from "../pet/pet.entity";

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  lastname!: string;

  @Column()
  age!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ unique: true })
  email!: string;

  @ManyToMany(() => PetEntity, pet => pet.users)
  @JoinTable({
    name: 'user_pets',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'pet_id', referencedColumnName: 'id' },
  })
  pets!: PetEntity[];
}
