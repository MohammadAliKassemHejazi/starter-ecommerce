'use strict';

import { Model, UUIDV4 } from 'sequelize';
import { ICartAttributes } from '../interfaces/types/models/cart.model.types';

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends Model<ICartAttributes> implements ICartAttributes {
    id!: string;

    static associate(models: any) {
      // Define the relationship with User
      Cart.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });

      // Define the relationship with CartItem
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cartId', // Foreign key in CartItem pointing to Cart
        onDelete: 'CASCADE',
      });
    }
  }

  Cart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    },
  );

  return Cart;
};
