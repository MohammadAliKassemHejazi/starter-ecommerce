import { CustomErrorParams } from "utils/customError";

export const PaymentFailed : CustomErrorParams = {
message: "Payment failed", 
    code: "PAYMENT_FAILED", 
    statusCode: 400 
};


export const WebhookVerificationFailed : CustomErrorParams = {

    message: "Webhook verification failed", 
    code: "WEBHOOK_VERIFICATION_FAILED", 
    statusCode: 400 

};


export default {
    PaymentFailed,
    WebhookVerificationFailed

}




