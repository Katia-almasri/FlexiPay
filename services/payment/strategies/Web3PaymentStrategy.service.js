import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import { InfuraProvider, ethers } from "ethers";
import { web3NetworkTypes } from "../../../enums/Web3NetworkType.enum.js";
import dotenv from "dotenv";
import { providerTypes } from "../../../enums/ProviderType.enum.js";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "../Transaction.service.js";

dotenv.config();

export class web3PaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this._provider = new InfuraProvider(
      web3NetworkTypes.SEPOLIA, //primarily
      process.env.INFURA_PROJECT_ID
    );
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this._provider);
  }

  async pay(data) {
    if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
      throw new Error("Invalid amount");
    }

    try {
      let existingCredentials = Object.fromEntries(data.credentials);
      const walletAddress = existingCredentials.wallet_address;

      // create the transaction
      data = {
        amount: data.amount,
        currency: data.currency,
        provider: providerTypes.WEB3,
        customerId: data.user_id,
        merchantId: data.merchantId,
        userWallet: walletAddress,
        paymentIntentId: 0, //initially
        providerMetaData: {
          web3: {
            to: process.env.FLEXIPAY_PUBLIC_KEY,
            expectedAmount: data.amount.toString(),
            token: data.currency,
            chain: "ethereum",
            paymentReference: uuidv4(),
          },
        },
      };
      //2. add the succeeded payment to the transaction model
      const transaction = await createTransaction(data);
      console.log(transaction);
      return {
        transaction: transaction,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refund(amount, paymentIntentId) {}
}
