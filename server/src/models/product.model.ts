"use strict";
import * as Sequelize from "sequelize";
import { Model, UUIDV4 } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    stockQuantity?: number;
    isActive?: boolean;

    static associate(models: any) {
      Product.hasMany(models.ProductImage); // Establishing one-to-many relationship
      Product.hasMany(models.CartItem);
      Product.hasMany(models.Favorite);
      Product.hasMany(models.OrderItem);
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
