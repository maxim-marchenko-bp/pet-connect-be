import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../common/entities/base.entity";

@Entity()
export class RefreshToken extends BaseEntity {
  @Column({ name: 'expires_at' })
  expiresAt!: Date;

  @Column({ name: 'token-hash' })
  tokenHash!: string;

  @Column({ name: 'user_id' })
  userId!: number;
}
