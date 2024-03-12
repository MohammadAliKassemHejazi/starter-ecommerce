"use strict";

import { Model, DataTypes } from "sequelize";
import { IOrderItemAttributes } from "../interfaces/types/models/orderitem.model.types";

module.exports = (sequelize: any) => {
  class OrderItem extends Model<IOrderItemAttributes> implements IOrderItemAttributes {
    id!: string;
    orderId!: string;
    productId!: string;
    quantity!: number;
    price!: number;

    static associate(models: any) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderItem.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }

  OrderItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    orderId: {
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
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'OrderItem'
  });

  return OrderItem;
};
