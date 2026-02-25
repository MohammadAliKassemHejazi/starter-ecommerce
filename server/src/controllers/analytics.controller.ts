import { Request, Response } from 'express';
import { ResponseFormatter } from '../utils/responseFormatter';
import * as analyticsService from '../services/analytics.service';

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { eventType, eventData, sessionId, pageUrl } = req.body;

    const analytics = await analyticsService.trackEvent(userId, eventType, eventData, sessionId, pageUrl);

    ResponseFormatter.success(res, analytics, 'Event tracked successfully', 201);
  } catch (error) {
    console.error('Error tracking event:', error);
    ResponseFormatter.error(res, 'Failed to track event', 500);
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { eventType, startDate, endDate, page = 1, limit = 10 } = req.query;

    const { count, rows } = await analyticsService.getAnalytics({
      eventType,
      startDate,
      endDate,
      page: Number(page),
      limit: Number(limit),
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Analytics retrieved successfully');
  } catch (error) {
    console.error('Error getting analytics:', error);
    ResponseFormatter.error(res, 'Failed to get analytics', 500);
  }
};

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const stats = await analyticsService.getEventStats({
      startDate,
      endDate,
    });

    ResponseFormatter.success(res, stats, 'Event statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting event stats:', error);
    ResponseFormatter.error(res, 'Failed to get event stats', 500);
  }
};
