import env from "../config/env";
import { sign, verify } from "hono/jwt";
import { Types } from "mongoose";

const Jwt = () => {
  const signToken = (id: Types.ObjectId) => {
    return sign(id, env.SECRET_KEY, "HS256");
  };

  const verifyToken = async (tokenToVerify: string) => {
    try {
      return verify(tokenToVerify, env.SECRET_KEY);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        throw new Error(err.message);
      }
    }
  };

  return {
    signToken,
    verifyToken,
  };
};

export default Jwt;
