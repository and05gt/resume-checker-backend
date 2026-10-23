import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length) {
  console.error(`Missing require env vars: ${missing.join(', ')}`);
  process.exit(1);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoDbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'rc_token',
  clientOrigin: (
    process.env.CLIENT_ORIGIN ||
    'http://localhost:5174,http://localhost:5173,http://localhost:3000,https://resume-checker-backend-rho.vercel.app'
  )
    .split(',')
    .map(o => o.trim())
    .filter(Boolean),
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  isProd: process.env.NODE_ENV === 'production',
};
