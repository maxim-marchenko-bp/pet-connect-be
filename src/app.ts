import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from "./data-source";
import userRouter from "./modules/user/user.routes";
import authRouter from "./modules/auth/auth.routes";
import { errorHandler } from "./common/middleware/error-handler";
import cookieParser from 'cookie-parser';
import refreshTokenRoutes from "./modules/refresh-token/refresh-token.routes";

dotenv.config();
const PORT = process.env.PORT || 4000;
const app = express();

AppDataSource.initialize()
  .then(() => console.log('Data source initialized'))
  .catch((error: Error) => console.error('Error during data source initialization:', error));

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', refreshTokenRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
