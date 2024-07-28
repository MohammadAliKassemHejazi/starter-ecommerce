"use strict";

import { Model } from "sequelize";
import { ICartItemAttributes } from "../interfaces/types/models/cartitem.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends Model<ICartItemAttributes> implements ICartItemAttributes {
    id!: string;
    // cartId!: string;
    // productId!: string;
    quantity!: number;

    static associate(models: any) {
      CartItem.belongsTo(models.Cart, { foreignKey: 'cartId' , targetKey: 'id'});
      CartItem.belongsTo(models.Product, { foreignKey: 'productId' , targetKey: 'id'});
    }
  }

  CartItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'CartItem'
  });

  return CartItem;
};
