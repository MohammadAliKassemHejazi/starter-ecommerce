"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class TaxRule extends Model {
    static associate(models: any) {
      TaxRule.hasMany(models.Order);
    }
  }

  TaxRule.init({
    region: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    taxType: DataTypes.ENUM('VAT', 'GST', 'SALES_TAX')
  }, {
    sequelize,
    modelName: 'TaxRule'
  });

  return TaxRule;
};