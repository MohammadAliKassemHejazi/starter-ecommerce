import { Model } from 'sequelize';
import { ICategoryAttributes } from '../interfaces/types/models/category.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class Category extends Model<ICategoryAttributes> implements ICategoryAttributes {
    id!: string;
    name!: string;
    description?: string;

    static associate(models: any) {
      Category.hasMany(models.Subcategory, { as: 'subcategories' });
      Category.hasMany(models.Product, { as: 'products' });
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
  }, {
    sequelize,
    modelName: 'Category',
  });


  return  Category ;
};