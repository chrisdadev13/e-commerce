import { HTTPException } from "hono/http-exception";
import { UserModel } from "./user.model";
import { TCreationSchema } from "./user.schema";
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

const userService = {
  register,
};

export default userService;
