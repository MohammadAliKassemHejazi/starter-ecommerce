import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { eventType, eventData } = req.body;

    const analytics = await db.Analytics.create({
      eventType,
      eventData,
      userId
    });

    ResponseFormatter.success(res, analytics, 'Event tracked successfully', 201);
  } catch (error) {
    console.error('Error tracking event:', error);
    ResponseFormatter.error(res, 'Failed to track event', 500);
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const { eventType, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (eventType) whereClause.eventType = eventType;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    const { count, rows } = await db.Analytics.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
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
    
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    const stats = await db.Analytics.findAll({
      where: whereClause,
      attributes: [
        'eventType',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('eventType')), 'count']
      ],
      group: ['eventType'],
      raw: true
    });

    ResponseFormatter.success(res, stats, 'Event statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting event stats:', error);
    ResponseFormatter.error(res, 'Failed to get event statistics', 500);
  }
};
