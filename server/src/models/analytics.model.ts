"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Analytics extends Model {
    tenantId?: string; // RLS tenant isolation - analytics specific to super admin
    
    static associate(models: any) {
      Analytics.belongsTo(models.User);
    }
  }

  Analytics.init({
    eventType: DataTypes.STRING,
    eventData: DataTypes.JSON,
    userId: DataTypes.UUID,
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tenant_id', // RLS tenant isolation - analytics specific to super admin
    }
  }, {
    sequelize,
    modelName: 'Analytics',
    indexes: [{
      fields: ['eventType']
    }]
  });

  return Analytics;
};