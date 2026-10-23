import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import resumeRouter from './routes/resumes.js';
import dashboardRouter from './routes/dashboard.js';
import insightsRouter from './routes/insights.js';
import versionsRouter from './routes/versions.js';
import historyRouter from './routes/history.js';

export const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan('dev'));

let dbConnected = false;
app.use(async (_req, _res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/insights', insightsRouter);
app.use('/api/versions', versionsRouter);
app.use('/api/history', historyRouter);

app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);
});

if (!process.env.VERCEL) {
  const start = async () => {
    try {
      await connectDB();
      dbConnected = true;
      app.listen(env.port, () => {
        console.log(
          `Server listening on http://localhost:${env.port} (${env.nodeEnv})`
        );
      });
    } catch (error) {
      console.error(
        `Failed to start server: ${error instanceof Error ? error.message : error}`
      );
      process.exit(1);
    }
  };

  start();
}

export default app;
