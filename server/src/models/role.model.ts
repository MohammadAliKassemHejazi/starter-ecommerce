import { Model } from 'sequelize';
import { IRollAttributes } from "../interfaces/types/models/role.model.types";
module.exports = (sequelize: any, DataTypes: any) => {
  class Role extends Model<IRollAttributes> implements IRollAttributes {
    public id!: string;
    public name!: 'personal' | 'admin';

    static associate(models: any) {

      Role.belongsTo(models.User, { foreignKey: 'userId' });
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
            type: DataTypes.ENUM('personal', 'admin'),
            allowNull: false,
            unique: true,
          },
          userId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
          },
        },
        {
          sequelize,
          modelName: 'Role',
        }
      );
   


  return Role;
}