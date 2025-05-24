import express from "express";
import { stripeWebhook } from "../../controllers/payment/StripePaymentMethod.controller.js";
export let webhookRoutes = express.Router();

webhookRoutes.post("/stripe", stripeWebhook);
