import { web3PaymentStrategy } from "../services/payment/strategies/Web3PaymentStrategy.service.js";

// call the listening on Web3 transaction on blockchain ;)
export let web3Listener = async () => {
  try {
    await new web3PaymentStrategy().implementListening();
  } catch (error) {
    throw new Error(error.message);
  }
};
