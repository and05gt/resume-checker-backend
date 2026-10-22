import { type Request, type Response } from 'express';
import { getInsightsDataService } from '../services/insights.js';

export const getInsightsDataController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = await getInsightsDataService(req.user!._id.toString());

  res.json(data);
};
