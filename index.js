import express from "express";
import dotenv from "dotenv";
import { authRoutes } from "./routes/api/auth.js";
import { customerRoutes } from "./routes/api/customer.js";
import { connectDB } from "./config/Database.config.js";
import { paymentRoutes } from "./routes/api/payment.js";
import { isAuthenticated } from "./middleware/auth.middleware.js";

/**
 * Config
 */

dotenv.config();

/**
 * Middleware
 */
const app = express();
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
