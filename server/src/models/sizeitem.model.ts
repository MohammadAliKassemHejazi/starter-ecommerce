"use strict";

import { Model, UUIDV4, DataTypes, Sequelize } from "sequelize";
import { ISizeItemAttributes } from "../interfaces/types/models/sizeitem.model.types";

module.exports = (sequelize: Sequelize) => {
  class SizeItem extends Model<ISizeItemAttributes> implements ISizeItemAttributes {
    id!: string;
    quantity!: number;

    static associate(models: any) {
    SizeItem.belongsTo(models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
    SizeItem.belongsTo(models.Size, { foreignKey: 'sizeId', targetKey: 'id' });
    SizeItem.belongsTo(models.CartItem, { foreignKey: 'sizeId', targetKey: 'id' ,onDelete: 'CASCADE'});
      
    }
  }

  SizeItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sizeId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "SizeItem",
    tableName: "SizeItems",
    timestamps: true,
  });

  return SizeItem;
};
