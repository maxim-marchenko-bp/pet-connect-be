import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from "../../common/entities/base.entity";
import { Pet } from "../pet/pet.entity";

@Entity()
export class User extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  lastname!: string;

  @Column({ nullable: true })
  age!: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ unique: true })
  email!: string;

  @ManyToMany(() => Pet, pet => pet.users)
  @JoinTable({
    name: 'user_pets',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'pet_id', referencedColumnName: 'id' },
  })
  pets!: Pet[];
}
