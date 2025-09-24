import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';
import { TenantRequest } from '../middlewares/rls-tenant.middleware';

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { eventType, eventData } = req.body;
    const request = req as TenantRequest;

    const analyticsData: any = {
      eventType,
      eventData,
      userId
    };

    // Add tenant isolation if tenant context is available
    if (request.tenantId) {
      analyticsData.tenantId = request.tenantId;
    }

    const analytics = await db.Analytics.create(analyticsData);

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
    const request = req as TenantRequest;

    const whereClause: any = {};
    if (eventType) whereClause.eventType = eventType;
    if (startDate && endDate) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    // Add tenant isolation if tenant context is available
    if (request.tenantId) {
      whereClause.tenantId = request.tenantId;
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
    const request = req as TenantRequest;
    
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    // Add tenant isolation if tenant context is available
    if (request.tenantId) {
      whereClause.tenantId = request.tenantId;
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
