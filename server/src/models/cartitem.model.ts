'use strict';

import { Model } from 'sequelize';
import { ICartItemAttributes } from '../interfaces/types/models/cartitem.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends Model<ICartItemAttributes> implements ICartItemAttributes {
    id!: string;
    quantity!: number;
    sizeId!: string; // Add sizeId to track the selected size
    static associate(models: any) {
      // Define the relationship with Cart
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' });

      // Define the relationship with Product
      CartItem.belongsTo(models.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });

      CartItem.belongsTo(models.SizeItem, { foreignKey: 'sizeItemId', onDelete: 'CASCADE' });
    }
  }

  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sizeItemId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sizeId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Sizes',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'CartItem',
    },
  );

  return CartItem;
};
