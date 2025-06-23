// src/jobs/payoutJob.js

import { Merchant } from "../models/Merchant.model.js";
import { getPayoutService } from "../services/payout/PayoutFactory.service.js";

export async function processWeeklyPayouts() {
  const payoutService = getPayoutService();
  const merchants = await Merchant.find({ balance: { $gt: 0 } });

  for (const merchant of merchants) {
    console.log(merchant);
    const result = await payoutService.sendPayout({
      recipientName: merchant.accountHolderName,
      iban: merchant.iban,
      swift: merchant.swift,
      amount: merchant.balance,
      currency: merchant.currency,
      reference: `Weekly payout ${new Date().toISOString()}`,
    });

    if (result.success) {
      merchant.balance = 0;
      merchant.lastPayoutDate = new Date();
      await merchant.save();
      console.log(
        `✅ Payout sent to ${merchant._id} - ID: ${result.transactionId}`
      );
    } else {
      console.log(`❌ Payout failed for ${merchant._id}`, result.error);
    }
  }
}
