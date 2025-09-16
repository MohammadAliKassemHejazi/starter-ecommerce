"use strict";

import { Model, UUIDV4 } from "sequelize";
import { IFavoriteItemAttributes } from "../interfaces/types/models/favoriteitem.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class FavoriteItem extends Model<IFavoriteItemAttributes> implements IFavoriteItemAttributes {
    id!: string;
    // favoriteId?: string;
    // productId?: string;

    static associate(models: any) {
      FavoriteItem.belongsTo(models.Favorite, { foreignKey: 'favoriteId' , targetKey: 'id'});
      FavoriteItem.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id' });
    }
  }

  FavoriteItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    favoriteId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Favorites',
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'FavoriteItem'
  });

  return FavoriteItem;
};
