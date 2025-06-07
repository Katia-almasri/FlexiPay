import dotenv from "dotenv";
import { updateTransactionByCriteria } from "../payment/Transaction.service.js";
import { paypalEvents } from "../../enums/PaypalEvent.enum.js";
import { transactionStatus } from "../../enums/TransactionStatus.enum.js";
dotenv.config();

export const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(
      `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `PayPal Auth Failed: ${data.error_description || data.error}`
      );
    }

    return data.access_token;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const captureOrder = async (orderId) => {
  const accessToken = await getAccessToken();
  const res = await fetch(
    `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal Capture Failed: ${data.message}`);
  return data;
};

export let implementWebhook = async (data) => {
  try {
    const response = await fetch(
      "https://api.sandbox.paypal.com/v1/notifications/verify-webhook-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
            ).toString("base64"),
        },
        body: JSON.stringify(data.verificationBody),
      }
    );

    const returnedData = await response.json();
    const event = data.body.event_type;

    if (returnedData.verification_status === "SUCCESS") {
      const eventType = event; // e.g., PAYMENT.CAPTURE.COMPLETED
      const resource = data.body?.resource;
      const captureId = resource?.id;
      const links = resource?.links || [];

      let orderId = null;

      // Extract orderId from the "up" link
      const upLink = links.find((link) => link.rel === "up");
      if (upLink && upLink.href) {
        const match = upLink.href.match(/\/checkout\/orders\/([A-Z0-9]+)/);
        if (match && match[1]) {
          orderId = match[1]; // this is the paymentId (equivalent to paymentIntentId in Stripe)
        }
      }

      switch (eventType) {
        case paypalEvents.COMPLETED:
          console.log("✅ Payment Completed");
          console.log("Order ID (paymentIntentId):", orderId);
          console.log("Capture ID:", captureId);

          await updateTransactionByCriteria(
            { paymentIntentId: orderId },
            { status: transactionStatus.SUCCEED }
          );
          break;

        case paypalEvents.APPROVED:
          console.log("🟡 Payment Approved");
          await updateTransactionByCriteria(
            { paymentIntentId: resource.id },
            { status: transactionStatus.APPROVED }
          );
          break;

        case CANCELED:
          console.log("❌ Payment Canceled");
          break;
      }
    } else {
      throw new Error("❌ Verification failed");
    }
    return { recieved: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export let findPaymentIdFromWebhookLink = async (data) => {
  const links = data.resource.links;
  const upLink = links.find((link) => link.rel === "up");

  let paymentId = null;
  if (upLink && upLink.href) {
    // URL format: https://api.paypal.com/v2/checkout/orders/5O190127TN364715T
    const match = upLink.href.match(/\/checkout\/orders\/([A-Z0-9]+)/);
    if (match && match[1]) {
      paymentId = match[1];
    }
  }

  return paymentId;
};
