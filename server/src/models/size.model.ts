"use strict";

import { Model, UUIDV4, DataTypes, Sequelize } from "sequelize";
import { ISizeAttributes } from "../interfaces/types/models/size.model.types";

module.exports = (sequelize: Sequelize) => {
  class Size extends Model<ISizeAttributes> implements ISizeAttributes {
    id!: string;
    size!: string;

    static associate(models: any) {
      Size.hasMany(models.SizeItem, { foreignKey: 'sizeId', sourceKey: 'id' });
    }
  }

  Size.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "Size",
    tableName: "Sizes",
    timestamps: true,
  });

  return Size;
};
