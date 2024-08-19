"use strict";

import { Model, DataTypes } from "sequelize";
import { IRoleUserAttributes } from "../interfaces/types/models/roleuser.model.types";

module.exports = (sequelize: any) => {
  class RoleUser extends Model<IRoleUserAttributes> implements IRoleUserAttributes {
    id!: string;
    roleId!: string;
    userId!: string;

    static associate(models: any) {
      RoleUser.belongsTo(models.User, { foreignKey: 'userId' }); // RoleUser belongs to User
      RoleUser.belongsTo(models.Role, { foreignKey: 'roleId' }); // RoleUser belongs to Role
    }
  }

  RoleUser.init(
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
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RoleUser",
    }
  );

  return RoleUser;
};
