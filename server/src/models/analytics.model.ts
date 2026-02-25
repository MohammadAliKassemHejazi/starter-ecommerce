"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Analytics extends Model {
    static associate(models: any) {
      Analytics.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }

  Analytics.init({
    eventType: DataTypes.STRING,
    eventData: DataTypes.JSON,
    userId: DataTypes.UUID,
    sessionId: DataTypes.STRING,
    pageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Analytics',
    indexes: [
      { fields: ['eventType'] },
      { fields: ['sessionId'] }
    ]
  });

  return Analytics;
};