import { Model } from 'sequelize';
import { IUserPackageAttributes } from "../interfaces/types/models/userpackage.model.types";
module.exports = (sequelize: any, DataTypes: any) => {
  class UserPackage extends Model<IUserPackageAttributes> implements IUserPackageAttributes {
    public id!: string;
    public userId!: string;
    public packageId!: string;
    public purchaseDate!: Date;
    public expirationDate!: Date;

    static associate(models: any) {
      UserPackage.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      UserPackage.belongsTo(models.Package, { foreignKey: 'packageId', as: 'package' });
    }

  }
      UserPackage.init(
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          packageId: {
            type: DataTypes.UUID,
            allowNull: false,
          },
          purchaseDate: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          expirationDate: {
            type: DataTypes.DATE,
            allowNull: false,
          },
        },
        {
          sequelize,
          modelName: 'UserPackage',
        }
      );
  


  return UserPackage;
}