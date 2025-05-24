import express from "express";
import {
  store,
  indexByUser,
  index,
  showByUser,
  updateByUser,
  switchPrimaryPaymentMethod,
  destroy,
  pay,
} from "../../controllers/payment/PaymentMethod.controller.js";
import { storePaymentMethodSchema } from "../../validations/payment/StorePaymentMethod.validation.js";
import { updatePaymentMethodSchema } from "../../validations/payment/UpdatePaymentMethod.validation.js";
import { paySchema } from "../../validations/payment/Pay.validation.js";
import { validation } from "../../middleware/Validation.middleware.js";
import { isBeneficiary } from "../../middleware/IsBeneficiary.middleware.js";
import { customerRole } from "../../middleware/CustomerRole.middleware.js";
import {
  getPaymentMethod,
  defaultPaymentMethod,
} from "../../controllers/payment/StripePaymentMethod.controller.js";

export let paymentRoutes = express.Router();

// add new payment method
paymentRoutes.post(
  "/",
  [isBeneficiary, validation(storePaymentMethodSchema)],
  store
);

// show payment methods by the user
paymentRoutes.get("/me", isBeneficiary, indexByUser);

paymentRoutes.get("/", index);

paymentRoutes.get("/:id", isBeneficiary, showByUser);

paymentRoutes.put(
  "/:id",
  [isBeneficiary, validation(updatePaymentMethodSchema)],
  updateByUser
);

paymentRoutes.put("/switch/:id", isBeneficiary, switchPrimaryPaymentMethod);

paymentRoutes.delete("/:id", isBeneficiary, destroy);

paymentRoutes.put(
  "/stripe/payment-method/:id",
  isBeneficiary,
  getPaymentMethod
);

paymentRoutes.get("/stripe/attach/:id", isBeneficiary, defaultPaymentMethod);

// pay (the main functionality of the system)
paymentRoutes.post("/pay", [customerRole, validation(paySchema)], pay);
