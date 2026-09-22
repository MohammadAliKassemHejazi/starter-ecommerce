import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';
import { computeOrderTotal } from '../services/order.service';

// Order has no stored total-price column; attach it here from the
// eager-loaded orderItems so API consumers get a real number without
// duplicating/drifting a stored total on Order (see TASK-13).
const withOrderTotal = (returnRequest: any) => {
  const plain = returnRequest.toJSON ? returnRequest.toJSON() : returnRequest;
  if (plain.Order) {
    plain.Order.total = computeOrderTotal(plain.Order.orderItems);
    delete plain.Order.orderItems;
  }
  return plain;
};

export const getReturns = async (req: Request, res: Response) => {
  try {
    const { status, userId, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (userId) whereClause.userId = userId;

    const { count, rows } = await db.ReturnRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Order,
          attributes: ['id', 'orderNumber', 'currency', 'createdAt'],
          include: [{ model: db.OrderItem, as: 'orderItems', attributes: ['price', 'quantity'] }],
        },
        {
          model: db.User,
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
    });

    const mappedRows = rows.map(withOrderTotal);

    ResponseFormatter.paginated(res, mappedRows, Number(page), Number(limit), count, 'Return requests retrieved successfully');
  } catch (error) {
    console.error('Error getting returns:', error);
    ResponseFormatter.error(res, 'Failed to get return requests', 500);
  }
};

export const createReturnRequest = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).UserId;
    const { orderId, reason, refundAmount } = req.body;

    const returnRequest = await db.ReturnRequest.create({
      orderId,
      userId,
      reason,
      refundAmount,
      status: 'PENDING',
    });

    ResponseFormatter.success(res, returnRequest, 'Return request created successfully', 201);
  } catch (error) {
    console.error('Error creating return request:', error);
    ResponseFormatter.error(res, 'Failed to create return request', 500);
  }
};

export const updateReturnStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;

    const returnRequest = await db.ReturnRequest.findByPk(id);
    if (!returnRequest) {
      return ResponseFormatter.notFound(res, 'Return request not found');
    }

    await returnRequest.update({ status, resolutionNote });

    ResponseFormatter.success(res, returnRequest, 'Return request status updated successfully');
  } catch (error) {
    console.error('Error updating return status:', error);
    ResponseFormatter.error(res, 'Failed to update return status', 500);
  }
};

export const getReturnById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const returnRequest = await db.ReturnRequest.findByPk(id, {
      include: [
        {
          model: db.Order,
          attributes: ['id', 'orderNumber', 'currency', 'createdAt'],
          include: [{ model: db.OrderItem, as: 'orderItems', attributes: ['price', 'quantity'] }],
        },
        {
          model: db.User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!returnRequest) {
      return ResponseFormatter.notFound(res, 'Return request not found');
    }

    ResponseFormatter.success(res, withOrderTotal(returnRequest), 'Return request retrieved successfully');
  } catch (error) {
    console.error('Error getting return request:', error);
    ResponseFormatter.error(res, 'Failed to get return request', 500);
  }
};

export const deleteReturnRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const returnRequest = await db.ReturnRequest.findByPk(id);
    if (!returnRequest) {
      return ResponseFormatter.notFound(res, 'Return request not found');
    }

    await returnRequest.destroy();

    ResponseFormatter.success(res, null, 'Return request deleted successfully');
  } catch (error) {
    console.error('Error deleting return request:', error);
    ResponseFormatter.error(res, 'Failed to delete return request', 500);
  }
};
