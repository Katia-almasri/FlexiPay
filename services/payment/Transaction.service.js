import { Transaction } from "../../models/Transaction.model.js";
import { transactionResource } from "../../resources/payment/Transaction.resource.js";

export let createTransaction = async (data) => {
  const transaction = await Transaction.create(data);
  return await transactionResource(transaction);
};

export let updateTransactionByCriteria = async (criteria, data) => {
  const transaction = await Transaction.findOneAndUpdate(criteria, data, {
    new: true,
  });
  return await transactionResource(transaction);
};
