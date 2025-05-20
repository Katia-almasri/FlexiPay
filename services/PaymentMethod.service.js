import { User } from "../models/user.model.js";
import {
  PaymentMethodCollection,
  PaymentMethodResource,
} from "../resources/PaymentMethod.resource.js";

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
export let showPaymentMethodsByUser = async (userId, filter) => {
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

export let showPaymentMethods = async () => {};
