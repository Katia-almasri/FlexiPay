import Stripe from "stripe";
import dotenv from "dotenv";
import { CustomerStripe } from "../../resources/payment/stripe/CustomerStripe.resource.js";
import { User } from "../../models/user.model.js";

dotenv.config();

/**
 * This service is to manage the functionality of stripe, customers and methods
 */
const stripe = new Stripe(process.env.STRIPE_SECRET);

export let createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      name: user.name,
      email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
    });
    return CustomerStripe(customer);
  } catch (error) {
    throw new Error(error);
  }
};

export let makeDefaultStripePaymentMethod = async (userId, paymentMethodId) => {
  try {
    const user = await User.findById(userId);
    const paymentMethod = user.paymentMethods.id(paymentMethodId);
    const credentials = Object.fromEntries(paymentMethod.credentials);
    console.log(credentials);
    await stripe.paymentMethods.attach(credentials.payment_method_id, {
      customer: credentials.customer_id,
    });
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error.nessage);
  }
};
