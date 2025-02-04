

// OrderShipping.model.ts
"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class OrderShipping extends Model {
    static associate(models: any) {
      OrderShipping.belongsTo(models.Order);
      OrderShipping.belongsTo(models.ShippingMethod);
    }
  }

  OrderShipping.init({
    trackingNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    carrier: DataTypes.STRING,
    status: DataTypes.ENUM('PENDING', 'SHIPPED', 'DELIVERED')
  }, {
    sequelize,
    modelName: 'OrderShipping'
  });

  return OrderShipping;
};