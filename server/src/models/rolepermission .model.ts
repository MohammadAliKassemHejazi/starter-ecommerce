"use strict";

import { Model, DataTypes } from "sequelize";
import { IRolePermissionAttributes } from "../interfaces/types/models/rolepermission.model.types";

module.exports = (sequelize: any) => {
  class RolePermission extends Model<IRolePermissionAttributes> implements IRolePermissionAttributes {
    id!: string;
    roleId!: string;
    permissionId!: string;

    static associate(models: any) {
      RolePermission.belongsTo(models.Role, { foreignKey: 'roleId' }); // RolePermission belongs to Role
      RolePermission.belongsTo(models.Permission, { foreignKey: 'permissionId' }); // RolePermission belongs to Permission
    }
  }

  RolePermission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );

  return RolePermission;
};
