"use strict";

import { Model, UUIDV4, DataTypes, ForeignKey, Sequelize } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";
import { IUserAttributes } from "../interfaces/types/models/user.model.types";
import { ICategoryAttributes } from "../interfaces/types/models/category.model.types";
import { ISubcategoryAttributes } from "../interfaces/types/models/subcategory.model.types";
import { IStoreAttributes } from "../interfaces/types/models/store.model.types";

module.exports = (sequelize: Sequelize) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    stockQuantity?: number;
    isActive?: boolean;
    // ownerId!: ForeignKey<IUserAttributes['id']>;
    // categoryId!: ForeignKey<ICategoryAttributes['id']>;
    // subcategoryId!: ForeignKey<ISubcategoryAttributes['id']>;
    // storeId!: ForeignKey<IStoreAttributes['id']>;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    tags?: string;
    discount?: number;

    static associate(models: any) {
      Product.belongsTo(models.User, { foreignKey: 'ownerId', targetKey: 'id' });
      Product.belongsTo(models.Category, { foreignKey: 'categoryId', targetKey: 'id' });
      Product.belongsTo(models.SubCategory, { foreignKey: 'subcategoryId', targetKey: 'id' });
      Product.belongsTo(models.Store, { foreignKey: 'storeId', targetKey: 'id' });

      Product.hasMany(models.ProductImage, { foreignKey: 'productId' });
      Product.hasMany(models.CartItem, { foreignKey: 'productId' });
      Product.hasMany(models.Favorite, { foreignKey: 'productId' });
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' });
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
    stockQuantity: {
      type: DataTypes.INTEGER,
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
    
  }, {
    sequelize,
    modelName: "Product",
    tableName: "Products", // Ensure the table name is consistent
    timestamps: true, // If you want timestamps like createdAt and updatedAt
  });

  return Product;
};
