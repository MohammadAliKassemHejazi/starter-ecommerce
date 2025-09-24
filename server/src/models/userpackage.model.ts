"use strict";

import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class UserPackage extends Model {
    id!: string;
    userId!: string;
    packageId!: string;
    startDate!: Date;
    endDate!: Date | null;
    isActive!: boolean;
    createdById!: string | null; // Track who assigned this package

    static associate(models: any) {
      UserPackage.belongsTo(models.User, { foreignKey: 'userId' });
      UserPackage.belongsTo(models.Package, { foreignKey: 'packageId' });
      UserPackage.belongsTo(models.User, { foreignKey: 'createdById', as: 'CreatedBy' });
    }
  }

  UserPackage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      packageId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Packages',
          key: 'id'
        }
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdById: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
    },
    {
      sequelize,
      modelName: "UserPackage",
    }
  );

  return UserPackage;
};