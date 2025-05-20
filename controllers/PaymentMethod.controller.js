import {
  addPaymentMethod,
  showPaymentMethodsByUser,
} from "../services/PaymentMethod.service.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";
import { paginate, sliceRanges } from "../utils/common/Paginate.util.js";
import { response } from "../utils/common/RestfulApi.util.js";

export let store = async (req, res) => {
  try {
    const data = {
      type: req.body.type,
      credentials: req.body.credentials,
      isPrimary: req.body.is_primary,
    };
    let paymentMethod = await addPaymentMethod(req.user.id, data);
    return res.status(statusCode.OK).json({
      data: paymentMethod,
      msg: "new payment method just added to you!",
      status: statusCode.OK,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.msg,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export let indexByUser = async (req, res) => {
  try {
    const paymentMethods = await showPaymentMethodsByUser(
      req.user.id,
      req.query
    );

    const pagination = paginate(paymentMethods, req.query);
    const ranges = sliceRanges(req.query.page ?? 1, pagination.limit);
    return res
      .status(statusCode.OK)
      .json(
        response(
          paymentMethods.slice(ranges.start, ranges.end),
          statusCode.OK,
          "Fetched successfully",
          pagination
        )
      );
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: error.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
