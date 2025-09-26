"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Analytics extends Model {
    static associate(models: any) {
      Analytics.belongsTo(models.User);
    }
  }

  Analytics.init({
    eventType: DataTypes.STRING,
    eventData: DataTypes.JSON,
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Analytics',
    indexes: [{
      fields: ['eventType']
    }]
  });

  return Analytics;
};