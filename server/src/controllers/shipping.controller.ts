import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

// Shipping Methods
export const getShippingMethods = async (req: Request, res: Response) => {
  try {
    const shippingMethods = await db.ShippingMethod.findAll({
      order: [['name', 'ASC']],
    });

    ResponseFormatter.success(res, shippingMethods, 'Shipping methods retrieved successfully');
  } catch (error) {
    console.error('Error getting shipping methods:', error);
    ResponseFormatter.error(res, 'Failed to get shipping methods', 500);
  }
};

export const createShippingMethod = async (req: Request, res: Response) => {
  try {
    const { name, cost, deliveryEstimate } = req.body;

    const shippingMethod = await db.ShippingMethod.create({
      name,
      cost,
      deliveryEstimate,
    });

    ResponseFormatter.success(res, shippingMethod, 'Shipping method created successfully', 201);
  } catch (error) {
    console.error('Error creating shipping method:', error);
    ResponseFormatter.error(res, 'Failed to create shipping method', 500);
  }
};

export const updateShippingMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, cost, deliveryEstimate } = req.body;

    const shippingMethod = await db.ShippingMethod.findByPk(id);
    if (!shippingMethod) {
      return ResponseFormatter.notFound(res, 'Shipping method not found');
    }

    await shippingMethod.update({ name, cost, deliveryEstimate });

    ResponseFormatter.success(res, shippingMethod, 'Shipping method updated successfully');
  } catch (error) {
    console.error('Error updating shipping method:', error);
    ResponseFormatter.error(res, 'Failed to update shipping method', 500);
  }
};

export const deleteShippingMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shippingMethod = await db.ShippingMethod.findByPk(id);
    if (!shippingMethod) {
      return ResponseFormatter.notFound(res, 'Shipping method not found');
    }

    await shippingMethod.destroy();

    ResponseFormatter.success(res, null, 'Shipping method deleted successfully');
  } catch (error) {
    console.error('Error deleting shipping method:', error);
    ResponseFormatter.error(res, 'Failed to delete shipping method', 500);
  }
};

// Order Shipping
export const getOrderShippings = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status) whereClause.status = status;

    const { count, rows } = await db.OrderShipping.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Order,
          attributes: ['id', 'orderNumber', 'totalPrice'],
        },
        {
          model: db.ShippingMethod,
          attributes: ['id', 'name', 'cost'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Order shippings retrieved successfully');
  } catch (error) {
    console.error('Error getting order shippings:', error);
    ResponseFormatter.error(res, 'Failed to get order shippings', 500);
  }
};

export const createOrderShipping = async (req: Request, res: Response) => {
  try {
    const { orderId, shippingMethodId, trackingNumber, carrier } = req.body;

    const orderShipping = await db.OrderShipping.create({
      orderId,
      shippingMethodId,
      trackingNumber,
      carrier,
      status: 'PENDING',
    });

    ResponseFormatter.success(res, orderShipping, 'Order shipping created successfully', 201);
  } catch (error) {
    console.error('Error creating order shipping:', error);
    ResponseFormatter.error(res, 'Failed to create order shipping', 500);
  }
};

export const updateOrderShippingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orderShipping = await db.OrderShipping.findByPk(id);
    if (!orderShipping) {
      return ResponseFormatter.notFound(res, 'Order shipping not found');
    }

    await orderShipping.update({ status });

    ResponseFormatter.success(res, orderShipping, 'Order shipping status updated successfully');
  } catch (error) {
    console.error('Error updating order shipping status:', error);
    ResponseFormatter.error(res, 'Failed to update order shipping status', 500);
  }
};
