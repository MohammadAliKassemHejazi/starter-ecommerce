"use strict";
import { Model, DataTypes } from "sequelize";

module.exports = (sequelize: any) => {
  class UserSession extends Model {
    static associate(models: any) {
      UserSession.belongsTo(models.User);
    }
  }

  UserSession.init({
    ipAddress: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    loginAt: DataTypes.DATE,
    logoutAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserSession'
  });

  return UserSession;
};