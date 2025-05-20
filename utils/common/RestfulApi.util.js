import { statusCode } from "../../enums/common/StatusCode.enum.js";

export let response = (
  data = null,
  code = statusCode.OK,
  msg = "",
  paginate = null
) => {
  return { data, code, msg, paginate };
};
