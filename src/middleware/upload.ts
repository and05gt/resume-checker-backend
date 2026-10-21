import { type Request, type Response, type NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { AppError } from '../utils/appError.js';

const MAX_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(AppError.badRequest('Only PDF files are accepted'));
    }
    cb(null, true);
  },
});

export const uploadPdf =
  (field = 'file') =>
  (req: Request, res: Response, next: NextFunction) => {
    upload.single(field)(req, res, error => {
      if (error instanceof MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return next(AppError.badRequest('PDF exceeds 5Mb limit'));
        }
        return next(AppError.badRequest(error.message));
      }
      if (error) return next(error);
      if (!req.file) return next(AppError.badRequest('No file uploaded'));
      next();
    });
  };
