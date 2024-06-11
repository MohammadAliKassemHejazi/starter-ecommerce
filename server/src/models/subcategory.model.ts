import { Model } from 'sequelize';
import { ISubcategoryAttributes } from '../interfaces/types/models/subcategory.model.types';

module.exports = (sequelize: any, DataTypes: any) => {


  class SubCategory extends Model<ISubcategoryAttributes> implements ISubcategoryAttributes {
    id!: string;
    categoryId!: string;
    name!: string;

    static associate(models: any) {
      SubCategory.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      SubCategory.hasMany(models.Product, { as: 'products' });
    }
  }

  SubCategory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Subcategory',
  });

  return SubCategory;
};
