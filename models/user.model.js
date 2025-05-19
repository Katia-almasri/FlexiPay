import mongoose from "mongoose";
import { roles } from "../enums/userRole.enum.js";
import { providerTypes } from "../enums/ProviderType.enum.js";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      paymentMethods: [
        {
          provider: { type: String, enum: Object.values(providerTypes) },
          details: {
            type: mongoose.Schema.Types.Mixed,
            // Example: { email: "paypal@example.com" } or { address: "0xabc..." }
          },
        },
      ],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      required: true,
      default: roles.CUSTOMER,
    },
  },
  {
    timestamp: true,
  }
);

// preprocessing for the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
