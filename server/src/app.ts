import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import accountRoutes from './routes/accountRoutes';
import { env } from './config/env';

const app = express();

app.use('/static', express.static(path.join(__dirname, '../public')));
app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

export default app;