import db from '../models';

export const trackEvent = async (userId: string, eventType: string, eventData: any, sessionId?: string, pageUrl?: string) => {
  return await db.Analytics.create({
    userId,
    eventType,
    eventData,
    sessionId,
    pageUrl,
  });
};

export const getAnalytics = async (query: any) => {
  const { eventType, startDate, endDate, page = 1, limit = 10 } = query;
  const offset = (Number(page) - 1) * Number(limit);

  const whereClause: any = {};
  if (eventType) whereClause.eventType = eventType;
  if (startDate && endDate) {
    whereClause.createdAt = {
      [db.Sequelize.Op.between]: [startDate, endDate],
    };
  }

  return await db.Analytics.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.User,
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset,
  });
};

export const getEventStats = async (query: any) => {
  const { startDate, endDate } = query;

  const whereClause: any = {};
  if (startDate && endDate) {
    whereClause.createdAt = {
      [db.Sequelize.Op.between]: [startDate, endDate],
    };
  }

  return await db.Analytics.findAll({
    where: whereClause,
    attributes: ['eventType', [db.Sequelize.fn('COUNT', db.Sequelize.col('eventType')), 'count']],
    group: ['eventType'],
    raw: true,
  });
};
