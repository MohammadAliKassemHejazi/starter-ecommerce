import { Model } from 'sequelize';
import { IPackageAttributes } from '../interfaces/types/models/package.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class Package extends Model<IPackageAttributes> implements IPackageAttributes {
    public id!: string;
    public name!: string;
    public description?: string;
    public storeLimit!: number;
    public categoryLimit!: number;
    public productLimit!: number;
    public userLimit!: number;
    public isSuperAdminPackage!: boolean;
    public price!: number;
    public isActive!: boolean;

    static associate(models: any) {
      Package.hasMany(models.UserPackage, { foreignKey: 'packageId' });
      Package.belongsToMany(models.User, {
        through: models.UserPackage,
        foreignKey: 'packageId',
        otherKey: 'userId',
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
        defaultValue: 0,
      },
      productLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isSuperAdminPackage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Package',
    },
  );

  return Package;
};
