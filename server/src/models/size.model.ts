"use strict";

import { Model, UUIDV4, DataTypes, Sequelize } from "sequelize";
import { ISizeAttributes } from "../interfaces/types/models/size.model.types";

module.exports = (sequelize: Sequelize) => {
  class Size extends Model<ISizeAttributes> implements ISizeAttributes {
    id!: string;
    productId!: string;
    size!: string;
    quantity!: number;

    static associate(models: any) {
      Size.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id' });
    }
  }

  Size.init({
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
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: "Size",
    tableName: "Sizes",
    timestamps: true,
  });

  return Size;
};
