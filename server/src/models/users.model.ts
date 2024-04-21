"use strict";

import { Model, DataTypes } from "sequelize";
import { IUserAttributes } from "../interfaces/types/models/user.model.types";

module.exports = (sequelize: any) => {
  class User extends Model<IUserAttributes> implements IUserAttributes {
    id!: string;
    name!: string;
    email!: string;
    password!: string;
    phone!: string;
    address!: string;

    static associate(models: any) {
      // one to one realtion
      User.hasOne(models.Package, { foreignKey: 'userId', as: 'package' }); // User can have one package subscription
      User.hasOne(models.Role, { foreignKey: 'userId', as: 'role' }); // user can have 1 role 

      //  one to many
      User.hasMany(models.Store, { foreignKey: 'userId', as: 'stores' }); // User can have many stores
      User.hasMany(models.Article, { foreignKey: 'userId' }); // User can have many articles
      User.hasMany(models.Order, { foreignKey: 'userId' }); // User can have many orders
      User.hasMany(models.CartItem, { foreignKey: 'userId' }); // User can have many cart items
      User.hasMany(models.FavoriteItem, { foreignKey: 'userId' }); // User can have many favorite items
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(150),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
