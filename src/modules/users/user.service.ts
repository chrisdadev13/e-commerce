import { HTTPException } from "hono/http-exception";
import { UserModel } from "./user.model";
import { TCreationSchema } from "./user.schema";
import { sanitizeUser } from "../../utils/sanitization";
import Jwt from "../../utils/jwt";

const create = async ({ name, email, password, role }: TCreationSchema) => {
  const doesExist = await UserModel.findOne({ email });
  if (doesExist)
    throw new HTTPException(409, { message: "Email address is already taken" });

  const user = new UserModel({ name, email, password, role });

  const token = await Jwt().signToken(user._id);

  user.sessions = [...user.sessions, token];
  await user.save();

  return {
    ...sanitizeUser(user),
    token,
  };
};

export default {
  create,
};
