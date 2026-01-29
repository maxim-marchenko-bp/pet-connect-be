import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";
import { User } from "../user/user.entity";
import { PetType } from "../pet-type/pet-type.entity";

@Entity()
export class Pet extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  age!: number;

  @ManyToOne(() => PetType, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({ name: 'pet_type_id' })
  type!: PetType;

  @ManyToMany(() => User, user => user.pets)
  users!: User[];
}
