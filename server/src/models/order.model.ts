import { Model, UUIDV4 } from 'sequelize';
import crypto from 'crypto';
import { IOrderAttributes } from '../interfaces/types/models/order.model.types';

// Human-readable, unique order number generated at insert time so callers
// (e.g. payment.service.ts's handleCartPaymentSuccess) never have to supply
// one. Format: ORD-YYYYMMDD-<8 hex chars>. The DB unique index is the real
// guarantee; the random suffix just makes a collision astronomically rare.
const generateOrderNumber = (): string => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(4).toString('hex');
  return `ORD-${datePart}-${randomPart}`;
};

module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model<IOrderAttributes> implements IOrderAttributes {
    id!: string;
    orderNumber!: string; // Unique, human-readable order number (e.g. ORD-20260922-000001)
    paymentId!: string; // Link to the Payment table

    static associate(models: any) {
      Order.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
      Order.belongsTo(models.Payment, { foreignKey: 'paymentId', targetKey: 'id' }); // Link to Payment
      Order.hasMany(models.OrderItem, { foreignKey: 'orderId', as: 'orderItems' });
      Order.hasMany(models.OrderShipping, { foreignKey: 'orderId', as: 'shippingDetails' });
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
      orderNumber: {
        type: DataTypes.STRING(24),
        allowNull: false,
        unique: true,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      hooks: {
        // Use setDataValue, not `order.orderNumber = ...`: this codebase's
        // Sequelize model classes declare attributes as TS class fields
        // (`orderNumber!: string`) under tsconfig target "ESNext", which
        // compiles with useDefineForClassFields -- each field becomes an
        // own instance property at construction time that SHADOWS
        // Sequelize's prototype-level attribute accessor, so plain
        // assignment never reaches `dataValues`. setDataValue writes
        // straight to the real internal store regardless of the shadow.
        beforeValidate: (order: any) => {
          if (!order.getDataValue('orderNumber')) {
            order.setDataValue('orderNumber', generateOrderNumber());
          }
        },
      },
    },
  );

  return Order;
};
