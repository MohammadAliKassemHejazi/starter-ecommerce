'use strict';

import { Model, DataTypes } from 'sequelize';
import { IPermissionAttributes } from '../interfaces/types/models/permission.model.types';

module.exports = (sequelize: any) => {
  class Permission extends Model<IPermissionAttributes> implements IPermissionAttributes {
    id!: string;
    name!: string;

    static associate(models: any) {
      Permission.hasMany(models.RolePermission, { foreignKey: 'permissionId' }); // Permission has many RolePermissions
    }
  }

  Permission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    },
  );

  return Permission;
};
