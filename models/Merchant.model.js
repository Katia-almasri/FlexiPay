// src/models/merchant.js

const mongoose = require("mongoose");

const merchantSchema = new mongoose.Schema({
  name: String,
  accountHolderName: String,
  iban: String,
  swift: String,
  accountNumber: String,
  currency: String,
  balance: Number,
  lastPayoutDate: Date,
});

module.exports = mongoose.model("Merchant", merchantSchema);
