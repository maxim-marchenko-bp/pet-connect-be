import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Common
import { AppDataSource } from "./data-source";
import { errorHandler } from "./common/middleware/error-handler";

// Routes
import refreshTokenRoutes from "./modules/refresh-token/refresh-token.routes";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import petRouter from "./modules/pet/pet.routes";
import petTypeRouter from "./modules/pet-type/pet-type.routes";
import { authenticate } from "./common/middleware/auth";

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log('Data source initialized'))
  .catch((error: Error) => console.error('Error during data source initialization:', error));

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(cookieParser());

// Auth
app.use('/api/auth', authRouter);
app.use('/api/auth', refreshTokenRoutes);

// Data
app.use('/api/users', [authenticate], userRouter);
app.use('/api/pets', [authenticate], petRouter);
app.use('/api/pet-types', [authenticate], petTypeRouter)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
