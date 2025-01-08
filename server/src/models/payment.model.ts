import { Model, UUIDV4 } from "sequelize";
import { IPaymentAttributes } from "../interfaces/types/models/payment.model.types";

module.exports = (sequelize: any, DataTypes: any) => {
  class Payment extends Model<IPaymentAttributes> implements IPaymentAttributes {
    id!: string;
    paymentIntentId!: string; // Stripe payment intent ID
    amount!: number; // Total amount paid
    currency!: string; // Currency of the payment
    status!: string; // Payment status (e.g., 'succeeded', 'failed', 'pending')
    orderId!: string; // Link to the associated order

    static associate(models: any) {
      Payment.belongsTo(models.Order, { foreignKey: 'orderId', targetKey: 'id' });
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending', // Default status
      }
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );

  return Payment;
};