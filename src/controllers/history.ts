import { type Request, type Response } from 'express';
import { getHistoryDataService } from '../services/history.js';

export const getHistoryDataController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = await getHistoryDataService(req.user!._id.toString());

  res.json(data);
};
