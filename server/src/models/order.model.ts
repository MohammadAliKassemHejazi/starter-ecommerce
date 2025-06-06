import { Model, UUIDV4 } from "sequelize";
import { IOrderAttributes } from "../interfaces/types/models/order.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model<IOrderAttributes> implements IOrderAttributes {
    id!: string;
    paymentId!: string; // Link to the Payment table

    static associate(models: any) {
      Order.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      Order.belongsTo(models.Payment, { foreignKey: 'paymentId', targetKey: 'id' }); // Link to Payment
      Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items", });
      Order.hasMany(models.OrderShipping);
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      currency: {
  type: DataTypes.STRING(3),
  allowNull: false,
  defaultValue: 'USD'
}
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};