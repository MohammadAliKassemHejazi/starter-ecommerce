"use strict";
import { Model, UUIDV4, ForeignKey } from "sequelize";
import { IProductAttributes } from "../interfaces/types/models/product.model.types";
// Assuming IUserAttributes is your User model interface
import { IUserAttributes } from "../interfaces/types/models/user.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<IProductAttributes> implements IProductAttributes {
    id!: string;
    name!: string;
    description!: string;
    price!: number;
    stockQuantity?: number;
    isActive?: boolean;
    // Adding the ownerId field
    ownerId!: ForeignKey<IUserAttributes['id']>;

    static associate(models: any) {
      // Other associations
      Product.hasMany(models.ProductImage);
      Product.hasMany(models.CartItem);
      Product.hasMany(models.Favorite);
      Product.hasMany(models.OrderItem);

      // Association to User
      Product.belongsTo(models.User, {
        foreignKey: 'ownerId', // Ensure this matches the name of the field added
        as: 'owner', // Optional: Alias for the association
      });
    }
  }

  Product.init(
    {
      // Other fields...
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
      // Define the ownerId field
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );

  return Product;
};
