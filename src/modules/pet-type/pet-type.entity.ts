import { BaseEntity } from "../../common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class PetType extends BaseEntity {
  @Column({ unique: true })
  code!: string;

  @Column()
  label!: string;
}
