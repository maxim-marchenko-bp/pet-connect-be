import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { PetType } from "./constants/pet-type.enum";
import { UserEntity } from "../user/user.entity";

@Entity()
export class PetEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: PetType,
  })
  type!: PetType;

  @Column()
  age!: number;

  @ManyToMany(() => UserEntity, user => user.pets)
  users!: UserEntity[];
}
