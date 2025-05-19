import { me } from "../services/Customer.service.js";
import { statusCode } from "../enums/common/StatusCode.enum.js";

export let customerProfile = async (req, res) => {
  try {
    let user = await me(req.user);
    if (!user) throw new Error("user does not exist!");

    return res.status(statusCode.OK).json({
      data: user,
      msg: "",
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
