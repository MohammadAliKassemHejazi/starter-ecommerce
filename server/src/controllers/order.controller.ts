import { Response } from "express";
import { orderService } from "../services";
import { CustomRequest } from "../interfaces/types/middlewares/request.middleware.types";


export const getLastOrder = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const userId = request.UserId; // Assuming UserId is accessible via middleware
    const lastOrder = await orderService.getLastOrder(userId!);
    
    const responseData: any = lastOrder;
    

    response.json(responseData);
  } catch (error) {
    next(error);
  }
};

export const getOrderItems = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { orderId } = request.params;
    const userId = request.UserId; // Assuming UserId is accessible via middleware

    const orderItems = await orderService.getOrderItems(orderId, userId!);
    response.json({ orderId, items: orderItems });
  } catch (error) {
    next(error);
  }
};

export const getOrdersByDateRange = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { from, to } = request.body; // Get from request body instead of query
    const userId = request.UserId;

    const orders = await orderService.getOrdersByDateRange(
      userId!,
      from as string,
      to as string
      );
  
    response.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  request: CustomRequest,
  response: Response,
  next: any
): Promise<void> => {
  try {
    const { storeId, page, pageSize, from, to } = request.query;

    if (storeId) {
      const pageNum = page ? parseInt(page as string) : 1;
      const pageSizeNum = pageSize ? parseInt(pageSize as string) : 10;

      const { rows, count } = await orderService.getOrdersByStore(
        storeId as string,
        pageNum,
        pageSizeNum,
        from as string,
        to as string
      );

      const totalPages = Math.ceil(count / pageSizeNum);

      response.json({
        items: rows,
        meta: {
          page: pageNum,
          pageSize: pageSizeNum,
          total: count,
          totalPages,
        },
      });
    } else {
      // Handle case where storeId is not provided if needed, or return error
       response.status(400).json({ success: false, message: "storeId is required" });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getLastOrder,
  getOrderItems,
  getOrdersByDateRange,
  getOrders,
};