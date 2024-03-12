"use strict";
import * as Sequelize from "sequelize";
import { Model, UUIDV4 } from "sequelize";
import { ICartAttributes } from "../interfaces/types/models/cart.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Cart extends Model<ICartAttributes> implements ICartAttributes {
    id!: string;

    static associate(models: any) {
      Cart.hasMany(models.CartItem);
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
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );

  return Cart;
};
