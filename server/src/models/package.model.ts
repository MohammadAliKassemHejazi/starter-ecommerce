import { Model } from 'sequelize';
import { IPackageAttributes } from "../interfaces/types/models/package.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Package extends Model<IPackageAttributes> implements IPackageAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public storeLimit!: number;
    public categoryLimit!: number;

    static associate(models: any) {
      Package.belongsToMany(models.User, {
        through: models.UserPackage,
        foreignKey: 'packageId',
        as: 'users',
      });
    }

  }
      Package.init(
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.TEXT,
            allowNull: true,
          },
          storeLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
          categoryLimit: {
            type: DataTypes.INTEGER,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'Package',
        }
      );
    
  

  return Package;
}