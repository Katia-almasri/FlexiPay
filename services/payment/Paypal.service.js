import dotenv from "dotenv";
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

export let implementWebhook = async (data, signature) => {};
