"use strict";

import { Model, UUIDV4, DataTypes, ForeignKey, Sequelize } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";

module.exports = (sequelize: Sequelize) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    isActive?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    tags?: string;
    discount?: number;
    tenantId?: string; // RLS tenant isolation

    static associate(models: any) {
      Product.belongsTo(models.User, { foreignKey: 'ownerId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.SubCategory, { foreignKey: 'subcategoryId', targetKey: 'id', onDelete: 'CASCADE' });
      Product.belongsTo(models.Store, { foreignKey: 'storeId', targetKey: 'id', onDelete: 'CASCADE' });

      Product.hasMany(models.ProductImage, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.CartItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.Favorite, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.OrderItem, { foreignKey: 'productId'});
      Product.hasMany(models.Comment, { foreignKey: 'productId', onDelete: 'CASCADE' });
      Product.hasMany(models.SizeItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
  }

  Product.init({
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'ownerId',  // Explicit field name
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'categoryId',  // Explicit field name
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'subcategoryId',  // Explicit field name
    },
    storeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'storeId',  // Explicit field name
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tenant_id', // RLS tenant isolation
    },
    
  }, {
    sequelize,
    modelName: "Product",
    tableName: "Products", // Ensure the table name is consistent
    timestamps: true, // If you want timestamps like createdAt and updatedAt
  });

  return Product;
};
