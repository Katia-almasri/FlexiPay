import express from "express";
import { stripeWebhook } from "../../controllers/payment/StripePaymentMethod.controller.js";
import bodyParser from "body-parser";

export let webhookRoutes = express.Router();

webhookRoutes.post(
  "/stripe",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
