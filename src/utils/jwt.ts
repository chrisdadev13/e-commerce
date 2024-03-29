import env from "../config/env";
import { sign, verify, decode } from "hono/jwt";
import { Types } from "mongoose";

const jwt = () => {
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

  const decodeToken = async (tokenToDecode: string) => {
    return decode(tokenToDecode);
  };

  return {
    signToken,
    verifyToken,
    decodeToken,
  };
};

export default jwt;
