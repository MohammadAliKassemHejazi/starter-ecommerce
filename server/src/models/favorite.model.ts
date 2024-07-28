"use strict";

import { Model, UUIDV4 } from "sequelize";

import { IFavoriteAttributes } from "../interfaces/types/models/favorite.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Favorite extends Model<IFavoriteAttributes> implements IFavoriteAttributes {
    id!: string;

    static associate(models: any) {
 Favorite.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      Favorite.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id' });
    }
  }

  Favorite.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "Favorite",
    }
  );

  return Favorite;
};
