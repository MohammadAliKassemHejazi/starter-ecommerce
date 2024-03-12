"use strict";

import { Model, DataTypes } from "sequelize";
import { IProductImageAttributes } from "../interfaces/types/models/productimage.model.types";

module.exports = (sequelize: any) => {
  class ProductImage extends Model<IProductImageAttributes> implements IProductImageAttributes {
    id!: string;
    productId!: string;
    imageUrl!: string;

    static associate(models: any) {
      ProductImage.belongsTo(models.Product, { foreignKey: 'productId' }); // Specify the foreign key
    }
  }

  ProductImage.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "ProductImage",
  });

  return ProductImage;
};
