"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class ReturnRequest extends Model {
    static associate(models: any) {
      ReturnRequest.belongsTo(models.Order);
      ReturnRequest.belongsTo(models.User);
    }
  }

  ReturnRequest.init({
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reason: DataTypes.TEXT,
    status: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    refundAmount: DataTypes.FLOAT,
    resolutionNote: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'ReturnRequest'
  });

  return ReturnRequest;
};