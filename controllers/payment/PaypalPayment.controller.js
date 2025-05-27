import { captureOrder } from "../../services/payment/Paypal.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";

export let capture = async (req, res) => {
  try {
    const { token } = req.query;
    const capture = await captureOrder(token);
    return res.status(statusCode.OK).json({
      data: capture,
      msg: "Payment captured!",
      status: statusCode.OK,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
