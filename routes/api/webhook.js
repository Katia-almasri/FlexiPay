import express from "express";
import { stripeWebhook } from "../../controllers/payment/StripePaymentMethod.controller.js";
import { paypalWebhook } from "../../controllers/payment/PaypalPayment.controller.js";
import bodyParser from "body-parser";

export let webhookRoutes = express.Router();

webhookRoutes.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

webhookRoutes.post(
  "/paypal",
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  }),
  paypalWebhook
);
