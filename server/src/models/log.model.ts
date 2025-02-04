"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class AuditLog extends Model {
    static associate(models: any) {
      AuditLog.belongsTo(models.User, { 
        foreignKey: 'performedById',
        as: 'PerformedBy'
      });
    }
  }

  AuditLog.init({
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entityId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    performedById: {
      type: DataTypes.UUID,
      allowNull: false
    },
    snapshot: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AuditLog',
    paranoid: true // Soft deletes
  });

  return AuditLog;
};