import { ForeignKey, Model } from 'sequelize';
import { ISubcategoryAttributes } from '../interfaces/types/models/subcategory.model.types';
import { ICategoryAttributes } from 'interfaces/types/models/category.model.types';

module.exports = (sequelize: any, DataTypes: any) => {


  class SubCategory extends Model<ISubcategoryAttributes> implements ISubcategoryAttributes {
    id!: string;

    name!: string;

    static associate(models: any) {
      SubCategory.belongsTo(models.Category, {  targetKey: 'id' ,foreignKey: 'categoryId' });
      SubCategory.hasMany(models.Product, {  foreignKey: 'subcategoryId' });
    }
  }

  SubCategory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SubCategory',
  });

  return SubCategory;
};
