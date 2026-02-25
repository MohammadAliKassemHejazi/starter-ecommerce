import { Model } from 'sequelize';
import { ISubCategoryAttributes } from 'interfaces/types/models/subcategory.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class SubCategory extends Model<ISubCategoryAttributes> implements ISubCategoryAttributes {
    id!: string;

    name!: string;

    static associate(models: any) {
      SubCategory.belongsTo(models.Category, { targetKey: 'id', foreignKey: 'categoryId' });
      SubCategory.hasMany(models.Product, { foreignKey: 'subcategoryId', onDelete: 'CASCADE' });
    }
  }

  SubCategory.init(
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
    },
    {
      sequelize,
      modelName: 'SubCategory',
    },
  );

  return SubCategory;
};
