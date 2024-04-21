import { Model } from 'sequelize';
import { IStoreAttributes } from "../interfaces/types/models/store.model.types"

module.exports = (sequelize: any, DataTypes: any) => {
  class Store extends Model<IStoreAttributes> implements IStoreAttributes {
    public id!: string;
    public name!: string;
    public userId!: string;
    public categoryId!: string;

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
        allowNull: true,
      },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Store',
        }
      );


  return Store;
}