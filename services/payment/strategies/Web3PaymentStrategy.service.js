import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import { InfuraProvider, ethers, JsonRpcProvider } from "ethers";
import { web3NetworkTypes } from "../../../enums/Web3NetworkType.enum.js";
import dotenv from "dotenv";
import { providerTypes } from "../../../enums/ProviderType.enum.js";
import { v4 as uuidv4 } from "uuid";
import { createTransaction } from "../Transaction.service.js";
import { Transaction } from "../../../models/Transaction.model.js";
import { transactionStatus } from "../../../enums/TransactionStatus.enum.js";
import { statusCode } from "../../../enums/common/StatusCode.enum.js";
import { web3ChainTypes } from "../../../enums/Web3ChainType.enum.js";
import { web3TokenTypes } from "../../../enums/Web3TokenType.enum.js";
import { updateTransactionByCriteria } from "../../../services/payment/Transaction.service.js";

dotenv.config();

export class web3PaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
    this._provider = new ethers.JsonRpcProvider(
      process.env.INFURA_RPC_URL,
      web3NetworkTypes.SEPOLIA
    );

    // web3PaymentStrategy._provider = new ethers.JsonRpcApiProvider(
    //   process.env.INFURA_RPC_URL
    // );
    this._wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this._provider);
  }

  // Getter:
  getProvider() {
    return web3PaymentStrategy._provider;
  }

  async pay(data) {
    if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0) {
      throw new Error("Invalid amount");
    }

    try {
      let existingCredentials = Object.fromEntries(data.credentials);
      const walletAddress = existingCredentials.wallet_address;
      //1. create the transaction
      data = {
        amount: data.amount,
        currency: data.currency,
        provider: providerTypes.WEB3,
        customerId: data.user_id,
        merchantId: data.merchantId,
        userWallet: walletAddress,
        paymentIntentId: "0", //initially
        providerMetaData: {
          web3: {
            to: process.env.FLEXIPAY_PUBLIC_KEY,
            expectedAmount: data.amount.toString(),
            token: data.currency,
            chain: web3ChainTypes.ETHERIUM,
            paymentReference: uuidv4(),
          },
        },
      };
      const transaction = await createTransaction(data);
      console.log(transaction);
      return {
        transaction: transaction,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async refund(transactionId, refundAmount) {
    try {
      const transaction = await Transaction.findById(transactionId);
      const toAddress = transaction.userWallet;
      console.log(`🔁 Refunding ${refundAmount} ETH to ${toAddress}`);

      // Create the transaction
      const tx = await this._wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(transaction.amount.toString()),
        gasLimit: process.env.GAS_LIMIT,
      });

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log("✅ Refund succeeded!");
        // update the transaction status
        await Transaction.findByIdAndUpdate(transactionId, {
          status: transactionStatus.CHARGE_REFUNDED,
          refundedAmount: refundAmount,
        });
        return {
          status: "success",
          txHash: tx.hash,
        };
      } else {
        console.error("❌ Refund failed in receipt");
        return {
          status: "failed",
          txHash: tx.hash,
        };
      }
    } catch (err) {
      console.error("❌ Refund error:", err);
      return {
        status: "error",
        error: err.message,
      };
    }
  }

  async implementListening() {
    console.log("🚀 Starting Ethereum payment listener...");

    const targetAddress = process.env.FLEXIPAY_PUBLIC_KEY.toLowerCase();
    console.log("📍 Listening for payments to:", targetAddress);

    let lastCheckedBlock = 0;
    const CHECK_EVERY_N_BLOCKS = 3;

    this._provider.on("block", async (blockNumber) => {
      try {
        if (blockNumber - lastCheckedBlock < CHECK_EVERY_N_BLOCKS) return;
        lastCheckedBlock = blockNumber;

        const block = await this._provider.getBlock(blockNumber);
        if (!block.transactions.length) return;

        for (const txHash of block.transactions.slice(0, 10)) {
          // reduce range
          const tx = await this._provider.getTransaction(txHash);
          if (!tx || !tx.to) continue;

          if (tx.to.toLowerCase() === targetAddress) {
            console.log("✅ Payment detected", {
              from: tx.from,
              value: ethers.formatEther(tx.value),
              hash: tx.hash,
            });
          }
        }
      } catch (err) {
        console.error("❌ Error in block listener:", err.message);
      }
    });
  }
}
