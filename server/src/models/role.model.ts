"use strict";

import { Model, DataTypes } from "sequelize";
import { IRoleAttributes } from "../interfaces/types/models/role.model.types";

module.exports = (sequelize: any) => {
  class Role extends Model<IRoleAttributes> implements IRoleAttributes {
    id!: string;
    name!: string;

    static associate(models: any) {
      Role.hasMany(models.RoleUser, { foreignKey: 'roleId' , onDelete: 'CASCADE' }); // Role has many RoleUsers
      Role.hasMany(models.RolePermission, { foreignKey: 'roleId', onDelete: 'CASCADE'  }); // Role has many RolePermissions
    }
  }

  Role.init(
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
      modelName: "Role",
    }
  );

  return Role;
};
