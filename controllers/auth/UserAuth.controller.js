import {
  create,
  checkUserExistence,
} from "../../services/auth/UserAuth.service.js";
import { statusCode } from "../../enums/common/StatusCode.enum.js";

export let registerUser = async (req, res) => {
  try {
    let data = await create(req.body);
    console.log(data);
    res.status(statusCode.CREATED).json({
      data: data,
      msg: "user created successfully!",
      status: statusCode.CREATED,
    });
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: err.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export let login = async (req, res) => {
  try {
    let loggedUser = await checkUserExistence(req.body);
    if (!loggedUser) {
      return res.status(statusCode.UNAUTHORIZED).json({
        data: null,
        msg: "un authenticated user!",
        status: statusCode.UNAUTHORIZED,
      });
    }

    return res.status(statusCode.OK).json({
      data: loggedUser,
      msg: "user logged in successfully!",
      status: statusCode.OK,
    });
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
      data: null,
      msg: err.message,
      status: statusCode.INTERNAL_SERVER_ERROR,
    });
  }
};
