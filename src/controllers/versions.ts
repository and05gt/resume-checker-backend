import { type Request, type Response } from 'express';
import { getVersionsService } from '../services/versions.js';

export const getVersionsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const versions = await getVersionsService(req.user!._id.toString());

  res.json(versions);
};
