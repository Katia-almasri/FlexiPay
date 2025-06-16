import express from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/api/auth.js";
import { customerRoutes } from "./routes/api/customer.js";
import { connectDB } from "./config/Database.config.js";
import { paymentRoutes } from "./routes/api/payment.js";
import { isAuthenticated } from "./middleware/auth.middleware.js";
import { webhookRoutes } from "./routes/api/webhook.js";
import { transactionRoutes } from "./routes/api/transaction.js";
import { paypalRoutes } from "./routes/api/paypal.js";
import { htmlRoutes } from "./routes/url/route.js";
import { errorHandler } from "./middleware/ErrorHandler.middleware.js";

/**
 * Config
 */

dotenv.config();

/**
 * Middleware
 */
const app = express();

app.use("/api/webhooks", webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Constants
 */
let port = process.env.PORT;

/**
 * Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/customers", isAuthenticated, customerRoutes);
app.use("/api/payment-methods", isAuthenticated, paymentRoutes);
app.use("/api/transactions", isAuthenticated, transactionRoutes);
app.use("/api/payment-methods/paypal", isAuthenticated, paypalRoutes);
//
app.use("/", htmlRoutes);

app.use(errorHandler);

/**
 * Initiaing App & DB
 */
try {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
} catch (error) {
  console.log(error);
}
