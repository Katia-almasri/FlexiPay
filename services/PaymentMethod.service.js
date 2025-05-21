import { paymentMethod } from "../enums/PaymentMethod.enum.js";
import { User } from "../models/user.model.js";
import {
  PaymentMethodCollection,
  PaymentMethodResource,
} from "../resources/payment/PaymentMethod.resource.js";

import { paymentMethodDetails } from "../resources/payment/PaymentMethodDetails.resource.js";

export let addPaymentMethod = async (userId, data) => {
  try {
    let user = await User.findById(userId);
    let { type, credentials, isPrimary = false } = data;
    user.paymentMethods.forEach((pm) => (pm.isPrimary = false));
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
  return PaymentMethodResource(paymentMethod);
};

export let updatePaymentMethodByUser = async (userId, data) => {
  const user = await User.findById(userId);
  let paymentMethod = user.paymentMethods.id(data.id);
  if (!paymentMethod) throw new Error("the payment method not found!");
  paymentMethod.credentials = new Map(Object.entries(data.credentials));
  paymentMethod.type = data.type;
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
  if (!paymentMethod) throw new Error("the payment method not found!");
  user.paymentMethods.pull(paymentMethodId);
  await user.save();
  return PaymentMethodResource(paymentMethod);
};
