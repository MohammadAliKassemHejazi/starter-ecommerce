// src/models/store.ts

import { Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { IStoreAttributes } from "../interfaces/types/models/store.model.types"

module.exports = (sequelize: any) => {
  class Store extends Model<IStoreAttributes> implements IStoreAttributes {
    public id!: string;
    public name!: string;
    public userId!: string;
    public categoryId!: string;
    public description?: string; // Define description field
    public image?: string; // Define image field

    static associate(models: any) {
      Store.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Store.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
    }
  }

  Store.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Define description as TEXT type
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING, // Define image as STRING type (URL or file path)
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Store',
    }
  );

  return Store;
};
