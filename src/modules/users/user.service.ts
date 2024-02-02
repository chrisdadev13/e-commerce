import { HTTPException } from "hono/http-exception";
import { UserModel } from "./user.model";
import type { TCreationSchema, TLoginSchema } from "./user.schema";
import { sanitizeUser } from "../../utils/sanitization";

import jwt from "../../utils/jwt";

const register = async ({ name, email, password, role }: TCreationSchema) => {
  const doesExist = await UserModel.exists({ email });
  if (doesExist)
    throw new HTTPException(409, { message: "Email address is already taken" });

  const user = new UserModel({ name, email, password, role });

  const token = await jwt().signToken(user._id);

  user.sessions = [...user.sessions, token];
  await user.save();

  return {
    user: sanitizeUser(user.toJSON()),
    token,
  };
};

const login = async ({ email, password }: TLoginSchema) => {
  const user = await UserModel.findOne({ email }).select("-password -sessions");
  if (!user)
    throw new HTTPException(409, { message: "Email address is already taken" });

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid)
    throw new HTTPException(401, { message: "Wrong password!" });

  const token = await jwt().signToken(user._id);
  user.sessions = [...user.sessions, token];
  await user.save();

  return {
    user,
    token,
  };
};

const userService = {
  register,
  login,
};

export default userService;
