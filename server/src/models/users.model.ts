'use strict';
import { Model, DataTypes } from 'sequelize';
import { IUserAttributes } from '../interfaces/types/models/user.model.types';

module.exports = (sequelize: any) => {
  class User extends Model implements IUserAttributes {
    declare id: string;
    declare name: string;
    declare email: string;
    declare password: string;
    declare phone: string;
    declare address: string;
    declare createdById: string | null; // Optional field to track who created the user
    static associate(models: any) {
      // One-to-one relations
      User.hasOne(models.Cart, { foreignKey: 'userId' });
      User.hasOne(models.Favorite, { foreignKey: 'userId' });

      // Package relationships
      User.hasMany(models.UserPackage, { foreignKey: 'userId' });
      User.belongsToMany(models.Package, {
        through: models.UserPackage,
        foreignKey: 'userId',
        otherKey: 'packageId',
        as: 'packages',
      });

      // One-to-many relations
      User.hasMany(models.Store, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Article, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Order, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.RoleUser, { foreignKey: 'userId', onDelete: 'CASCADE' });

      // Many-to-many relations through RoleUser
      User.belongsToMany(models.Role, {
        through: models.RoleUser,
        foreignKey: 'userId',
        otherKey: 'roleId',
        as: 'roles',
      });

      // NEW ASSOCIATION: A User can own/create many Categories
      User.hasMany(models.Category, {
        foreignKey: 'userId',
        as: 'CreatedCategories',
      });

      // NEW ASSOCIATION: A User can own/create many SubCategories
      User.hasMany(models.SubCategory, {
        foreignKey: 'userId',
        as: 'CreatedSubCategories',
      });

      // Self-referential relationship for tracking who created the user
      User.belongsTo(models.User, { foreignKey: 'createdById', as: 'CreatedBy' });
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
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true, // Optional field
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
