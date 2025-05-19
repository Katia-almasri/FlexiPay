import { User } from "../../models/user.model.js";
import { generateToken } from "../../utils/auth/GenerateToken.util.js";

export let create = async (data) => {
  const { username, email, password, role } = data;
  const user = await User.create({ username, email, password, role });
  const token = generateToken(user);
  return { token: token, user: user };
};

export let checkUserExistence = async (data) => {
  // get the data from it
  const email = data.email;
  const password = data.password;

  // check if exists in database
  let user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return null;
  } else {
    const token = generateToken(user);
    return { token: token, user: user };
  }
};

let logout = (data) => {};
