import express from "express";
import {
  store,
  indexByUser,
} from "../../controllers/PaymentMethod.controller.js";
import { storePaymentMethodSchema } from "../../validations/StorePaymentMethod.validation.js";
import { validation } from "../../middleware/Validation.middleware.js";
import { isBeneficiary } from "../../middleware/IsBeneficiary.middleware.js";

export let paymentRoutes = express.Router();

// add new payment method
paymentRoutes.post(
  "/",
  [isBeneficiary, validation(storePaymentMethodSchema)],
  store
);

// show payment methods by the user
paymentRoutes.get("/me", isBeneficiary, indexByUser);
