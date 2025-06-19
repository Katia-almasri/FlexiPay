import { baasTypes } from "../../enums/bank/BaasType.enum.js";
import { WisePayoutService } from "./WisePayout.service.js";
import dotenv from "dotenv";

dotenv.config();

export function getPayoutService() {
  const provider = process.env.PAYOUT_PROVIDER || "wise";

  switch (provider) {
    case baasTypes.WISE:
      return new WisePayoutService();
    default:
      throw new Error("Unsupported payout provider: " + provider);
  }
}
