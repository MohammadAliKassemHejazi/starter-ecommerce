import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { action, entity, performedById, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (action) whereClause.action = action;
    if (entity) whereClause.entity = entity;
    if (performedById) whereClause.performedById = performedById;

    const { count, rows } = await db.AuditLog.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'PerformedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
      paranoid: false // Include soft deleted records
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Audit logs retrieved successfully');
  } catch (error) {
    console.error('Error getting audit logs:', error);
    ResponseFormatter.error(res, 'Failed to get audit logs', 500);
  }
};

export const getAuditLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const auditLog = await db.AuditLog.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'PerformedBy',
          attributes: ['id', 'name', 'email']
        }
      ],
      paranoid: false
    });

    if (!auditLog) {
      return ResponseFormatter.notFound(res, 'Audit log not found');
    }

    ResponseFormatter.success(res, auditLog, 'Audit log retrieved successfully');
  } catch (error) {
    console.error('Error getting audit log:', error);
    ResponseFormatter.error(res, 'Failed to get audit log', 500);
  }
};

export const getAuditStats = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.createdAt = {
        [db.Sequelize.Op.between]: [startDate, endDate]
      };
    }

    const stats = await db.AuditLog.findAll({
      where: whereClause,
      attributes: [
        'action',
        [db.Sequelize.fn('COUNT', db.Sequelize.col('action')), 'count']
      ],
      group: ['action'],
      raw: true
    });

    ResponseFormatter.success(res, stats, 'Audit statistics retrieved successfully');
  } catch (error) {
    console.error('Error getting audit stats:', error);
    ResponseFormatter.error(res, 'Failed to get audit statistics', 500);
  }
};
