"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class Promotion extends Model {
    static associate(models: any) {
      Promotion.belongsToMany(models.Order, {
        through: 'PromotionOrders'
      });
    }
  }

  Promotion.init({
    code: {
      type: DataTypes.STRING,
      unique: true
    },
    type: DataTypes.ENUM('PERCENTAGE', 'FIXED'),
    value: DataTypes.FLOAT,
    minCartValue: DataTypes.FLOAT,
    validFrom: DataTypes.DATE,
    validTo: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Promotion'
  });

  return Promotion;
};