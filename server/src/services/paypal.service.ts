import { Client, Environment, OrdersController, CheckoutPaymentIntent, OrderApplicationContextUserAction, OrderApplicationContextLandingPage } from '@paypal/paypal-server-sdk';
import config from '../config/config';

class PayPalService {
  private client: Client;
  private ordersController: OrdersController;

  constructor() {
    this.client = new Client({
      environment: config.paypal?.environment === 'live' ? Environment.Production : Environment.Sandbox
    });
    this.ordersController = new OrdersController(this.client);
  }

  async createOrder(amount: number, currency: string = 'USD') {
    try {
      const response = await this.ordersController.createOrder({
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              amount: {
                currencyCode: currency,
                value: amount.toFixed(2)
              }
            }
          ],
          applicationContext: {
            brandName: 'E-commerce Store',
            landingPage: OrderApplicationContextLandingPage.NoPreference,
            userAction: OrderApplicationContextUserAction.PayNow,
            returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success`,
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cart`
          }
        }
      });
      
      if (response.statusCode === 201) {
        return {
          success: true,
          orderId: response.result.id,
          approvalUrl: response.result.links?.find((link: any) => link.rel === 'approve')?.href
        };
      } else {
        throw new Error(`PayPal order creation failed with status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('PayPal create order error:', error);
      throw new Error('Failed to create PayPal order');
    }
  }

  async captureOrder(orderId: string) {
    try {
      const response = await this.ordersController.captureOrder({
        id: orderId,
        body: {}
      });
      
      if (response.statusCode === 201) {
        const order = response.result;
        return {
          success: true,
          orderId: order.id,
          status: order.status,
          paymentId: order.purchaseUnits?.[0]?.payments?.captures?.[0]?.id,
          amount: order.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value,
          currency: order.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.currencyCode
        };
      } else {
        throw new Error(`PayPal order capture failed with status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('PayPal capture order error:', error);
      throw new Error('Failed to capture PayPal order');
    }
  }

  async getOrderDetails(orderId: string) {
    try {
      const response = await this.ordersController.getOrder({
        id: orderId
      });
      
      if (response.statusCode === 200) {
        return {
          success: true,
          order: response.result
        };
      } else {
        throw new Error(`PayPal get order failed with status: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('PayPal get order error:', error);
      throw new Error('Failed to get PayPal order details');
    }
  }
}

export default new PayPalService();
