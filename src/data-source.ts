import 'reflect-metadata'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { UserEntity } from './modules/user/user.entity'
import { PetEntity } from "./modules/pet/pet.entity";

dotenv.config()

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // auto-create tables (dev only)
  logging: true,
  entities: [UserEntity, PetEntity],
})
