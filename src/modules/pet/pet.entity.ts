import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { PetType } from "./constants/pet-type.enum";
import { User } from "../user/user.entity";

@Entity()
export class Pet extends BaseEntity {
  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: PetType,
  })
  type!: PetType;

  @Column()
  age!: number;

  @ManyToMany(() => User, user => user.pets)
  users!: User[];
}
