import { type Request, type Response } from 'express';
import { getDashboardDataService } from '../services/dashboard.js';

export const getDashboardDataController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = await getDashboardDataService(req.user!._id.toString());

  res.json(data);
};
