import { HydratedDocument } from "mongoose";
import { User } from "../modules/users/user.model";

export const sanitizeUser = (user: HydratedDocument<User>) => {
  const { password, sessions, ...sanitizeUser } = user;
  return sanitizeUser;
};
