import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export class StripePaymentStrategy extends PaymentStrategy {
  constructor(credentials) {
    super(credentials);
    this._stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async pay(data) {
    //1. create the intent
    const stripeClientSecret = await createStripePayment(data);
  }
}

let createStripePayment = async (data) => {
  const { amount, currency, customer, paymentMethod, merchantId, customerId } =
    data;
  const paymentIntent = await this._stripe.paymentIntents.create({
    amount,
    currency,
    customer,
    paymentMethod,
    confirm: true,
    description: `Payment from customer ${customerId} to merchant ${merchantId}`,
    metadata: {
      merchantId,
      customerId,
    },
  });
  return paymentIntent.client_secret;
};
