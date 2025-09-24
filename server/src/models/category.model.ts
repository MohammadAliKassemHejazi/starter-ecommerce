import { Model } from 'sequelize';
import { ICategoryAttributes } from '../interfaces/types/models/category.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class Category extends Model<ICategoryAttributes> implements ICategoryAttributes {
    id!: string;
    name!: string;
    description?: string;
    tenantId?: string; // RLS tenant isolation

    static associate(models: any) {
      Category.hasMany(models.SubCategory, {  foreignKey: 'categoryId' });
      Category.hasMany(models.Product, { foreignKey: 'categoryId' });
    }
  }

  Category.init({
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
    tenantId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'tenant_id', // RLS tenant isolation
    },
  }, {
    sequelize,
    modelName: 'Category',
  });


  return  Category ;
};