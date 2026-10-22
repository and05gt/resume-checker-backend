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

export const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());
if (!env.isProd) app.use(morgan('dev'));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(env.port, () => {
      console.log(
        `Server listening on http://localhost:${env.port} (${env.nodeEnv})`
      );
    });
  } catch (error) {
    console.error(
      `Failed to start server: ${error instanceof Error && error.message}`
    );
    process.exit(1);
  }
};

process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);
});

start();
