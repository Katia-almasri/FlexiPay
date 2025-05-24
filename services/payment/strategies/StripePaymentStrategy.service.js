import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export class StripePaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this._stripe = new Stripe(process.env.STRIPE_SECRET);
  }

  async pay(data) {
    return await this.createStripePayment(data);
  }

  async createStripePayment(data) {
    const paymentIntent = await this._stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency ?? process.env.CURRENCY,
      customer: data.customer_id,
      payment_method: data.payment_method_id,
      off_session: true,
      confirm: true,
    });
    return paymentIntent.client_secret;
  }
}
