import { FlattenMaps, Types } from "mongoose";
import { User } from "../modules/users/user.model";

export const sanitizeUser = (user: FlattenMaps<User & Types.ObjectId>) => {
  const { password, sessions, role, ...sanitizeUser } = user;
  return sanitizeUser;
};
