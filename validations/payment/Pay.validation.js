import Joi from "joi";
import { currencyTypes } from "../../enums/CurrencyType.enum.js";
export const paySchema = Joi.object({
  amount: Joi.number().required().messages({
    "any.required": "Amount is required.",
    "number.base": "Enter a valid amount.",
  }),
  payment_method_id: Joi.string().required().messages({
    "any.required": "Payment method id is required.",
    "string.empty": "Payment method id is required.",
  }),

  currency: Joi.string()
    .valid(...Object.values(currencyTypes))
    .messages({
      "any.only": `Type must be one of ${Object.values(currencyTypes)}.`,
    }),
});
