// ShippingMethod.model.ts
"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class ShippingMethod extends Model {
    static associate(models: any) {
      ShippingMethod.hasMany(models.OrderShipping);
    }
  }

  ShippingMethod.init({
    name: DataTypes.STRING,
    cost: DataTypes.FLOAT,
    deliveryEstimate: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ShippingMethod'
  });

  return ShippingMethod;
};