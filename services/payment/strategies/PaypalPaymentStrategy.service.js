import { PaymentStrategy } from "../../../abstracts/PaymentMethod.interface.js";
import { currencyTypes } from "../../../enums/CurrencyType.enum.js";
import { getAccessToken } from "../Paypal.service.js";

import dotenv from "dotenv";

dotenv.config();

export class PaypalPaymentStrategy extends PaymentStrategy {
  constructor() {
    super();
  }

  async pay(data) {
    console.log(data);
    const accessToken = await getAccessToken();

    const res = await fetch(
      `${process.env.PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: data.currency ?? currencyTypes.USD,
                value: data.amount.toString(),
              },
              custom_id: accessToken,
            },
          ],
          application_context: {
            return_url: data.returnUrl,
            cancel_url: data.cancelUrl,
          },
        }),
      }
    );

    data = await res.json();
    if (!res.ok) throw new Error(`PayPal Order Create Failed: ${data.message}`);
    return data;
  }
}
