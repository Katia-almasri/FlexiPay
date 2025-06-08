import mongoose from "mongoose";
import { currencyTypes } from "../enums/CurrencyType.enum.js";
import { transactionStatus } from "../enums/TransactionStatus.enum.js";
import { paymentMethod } from "../enums/PaymentMethod.enum.js";

const transactionSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: Object.values(paymentMethod),
      default: paymentMethod.STRIPE,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(transactionStatus),
      default: transactionStatus.PENDING,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: Object.values(currencyTypes),
      default: currencyTypes.USD,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentIntentId: {
      type: String,
      required: true,
    },

    providerMetadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
