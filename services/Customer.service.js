import { User } from "../models/user.model.js";

export let me = async (data) => {
  // return the current authenticated customer info
  try {
    const user = await User.findById(data.id).select("-password");
    if (!user) throw new Error();
    return user;
  } catch (err) {
    return null;
  }
};
