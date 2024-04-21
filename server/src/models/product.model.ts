"use strict";
import { Model,UUIDV4, ForeignKey } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";
import { IUserAttributes } from "../interfaces/types/models/user.model.types";
import { ICategoryAttributes } from "../interfaces/types/models/category.model.types";
import { ISubcategoryAttributes } from "../interfaces/types/models/subcategory.model.types";
import { IStoreAttributes } from "../interfaces/types/models/store.model.types"; 

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    stockQuantity?: number;
    isActive?: boolean;
    ownerId!: ForeignKey<IUserAttributes['id']>;
    categoryId!: ForeignKey<ICategoryAttributes['id']>;
    subcategoryId!: ForeignKey<ISubcategoryAttributes['id']>;
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
    tags?: string;
    inventoryStatus?: string;
    storeId!: ForeignKey<IStoreAttributes['id']>; // Add storeId to link to Store

    static associate(models: any) {
      // Existing associations
      Product.hasMany(models.ProductImage);
      Product.hasMany(models.CartItem);
      Product.hasMany(models.Favorite);
      Product.hasMany(models.OrderItem);
      Product.belongsTo(models.User, { foreignKey: 'ownerId'});
      Product.belongsTo(models.Category, { foreignKey: 'categoryId'});
      Product.belongsTo(models.Subcategory, { foreignKey: 'subcategoryId' });
          Product.belongsTo(models.Store, { foreignKey: 'storeId' });
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
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    inventoryStatus: {
      type: DataTypes.STRING,
      allowNull: true,
     
    },
  }, {
    sequelize,
    modelName: "Product",
  });

  return Product;
};
