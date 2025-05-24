import { paymentMethod } from "../../enums/PaymentMethod.enum.js";
import { User } from "../../models/user.model.js";
import {
  PaymentMethodCollection,
  PaymentMethodResource,
} from "../../resources/payment/PaymentMethod.resource.js";
import { createCustomer } from "../payment/Stripe.service.js";
import { paymentMethodDetails } from "../../resources/payment/PaymentMethodDetails.resource.js";
import { StripePaymentStrategy } from "../../services/payment/strategies/StripePaymentStrategy.service.js";

export let addPaymentMethod = async (userId, data) => {
  try {
    let user = await User.findById(userId);
    let { type, credentials, isPrimary = false } = data;
    user.paymentMethods.forEach((pm) => (pm.isPrimary = false));

    // check the payment methods types
    const requiredData = await createRequiredDataByPaymentMethod(type, user);
    credentials = { ...credentials, ...requiredData };
    user.paymentMethods.push({ type, credentials, isPrimary });
    await user.save();

    return PaymentMethodResource(
      user.paymentMethods[user.paymentMethods.length - 1]
    );
  } catch (error) {
    throw new Error(error);
  }
};

//show the payment method of this user
export let getPaymentMethodsByUser = async (userId, filter) => {
  const user = await User.findById(userId);
  let paymentMethods = user.paymentMethods;
  if (filter?.type)
    paymentMethods = paymentMethods.filter((pm) => pm.type == filter.type);
  if (filter?.is_primary) {
    const isPrimaryFilter = filter.is_primary === "true";
    paymentMethods = paymentMethods.filter(
      (pm) => pm.isPrimary === isPrimaryFilter
    );
  }
  return PaymentMethodCollection(paymentMethods);
};

export let getPaymentMethods = async () => {
  return [...Object.values(paymentMethod)];
};

export let showPaymentMethodByUser = async (userId, paymentMethodId) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(paymentMethodId);
  if (!paymentMethod) return null;
  return paymentMethodDetails(paymentMethod);
};

export let updatePaymentMethodByUser = async (userId, data) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(data.id);
  if (!paymentMethod) throw new Error("the payment method not found!");
  paymentMethod.credentials = new Map(Object.entries(data.credentials));
  paymentMethod.type = data.type ?? paymentMethod.type;
  await user.save();
  return paymentMethodDetails(paymentMethod);
};

export let switchPrimaryPaymentMethodById = async (userId, paymentMethodId) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(paymentMethodId);
  if (!paymentMethod) throw new Error("the payment method not found!");
  let paymentMethods = user.paymentMethods.filter((pm) =>
    pm.id == paymentMethodId ? (pm.isPrimary = true) : (pm.isPrimary = false)
  );
  await user.save();
  console.log(paymentMethods);
  return PaymentMethodResource(paymentMethod);
};

export let deletePaymentMethodById = async (userId, paymentMethodId) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(paymentMethodId);
  if (!paymentMethod) return null;
  user.paymentMethods.pull(paymentMethodId);
  await user.save();
  return PaymentMethodResource(paymentMethod);
};

/**
 * this function is just to add some additional required credentials for a given payment method
 */
export let addCredentialsToPaymentMethod = async (userId, data) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(data.id);
  if (!paymentMethod) throw new Error("the payment method not found!");
  let credentials = paymentMethod.credentials;
  let existingCredentials = Object.fromEntries(paymentMethod.credentials);
  credentials = { ...existingCredentials, ...data.stripePaymentMethod };
  paymentMethod.credentials = new Map(Object.entries(credentials));
  await user.save();
  return paymentMethodDetails(paymentMethod);
};

/**
 *  this function is to create the required data for each chosen payment method
 *  and attach it with the custome`s payment method details
 *  */
let createRequiredDataByPaymentMethod = async (chosenPaymentMethod, user) => {
  try {
    var requiredData = null;
    switch (chosenPaymentMethod) {
      case paymentMethod.STRIPE:
        // create the stripe customer
        const result = await createCustomer(user);
        requiredData = { customer_id: result.id };
        break;
      case paymentMethod.PAYPAL:
        break;

      case paymentMethod.CRYPTO:
        break;
      case paymentMethod.BANK:
        break;
    }
    return requiredData;
  } catch (error) {
    console.log(error.message);
  }
};

/**
 * this function is to execute the main payment function in the system
 */
export let performPayment = async (userId, paymentMethodId, data) => {
  const user = await User.findById(userId);
  const chosenPaymentMethod = user.paymentMethods.id(paymentMethodId);
  switch (chosenPaymentMethod.type) {
    case paymentMethod.STRIPE:
      //1. get the corresponding paymentMethodId of this customer
      let existingCredentials = Object.fromEntries(
        chosenPaymentMethod.credentials
      );
      const paymentMethodId = existingCredentials.payment_method_id;
      const customerId = existingCredentials.customer_id;
      const stripeStrategyInstance = new StripePaymentStrategy();
      data = {
        ...data,
        payment_method_id: paymentMethodId,
        customer_id: customerId,
      };

      const clientSecret = await stripeStrategyInstance.pay(data);
      return { client_secret: clientSecret };
  }
};
