import { Document, Model, Schema, Types, model } from "mongoose";
import { Bcrypt } from "oslo/password";

export enum Role {
  Admin = "Admin",
  Customer = "Customer",
}

export interface User {
  name: string;
  email: string;
  password: string;
  role: Role;
  sessions: string[];
}

export type TUserModel = Model<User>;

export type TUserDocument = Document<Types.ObjectId, any, User> & User;

const userSchema = new Schema<User, TUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Customer,
      required: true,
    },
    sessions: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const bcrypt = new Bcrypt();
  const hashedPassword = await bcrypt.hash(this.password);

  this.password = hashedPassword;

  return next();
});

export const UserModel = model<User, TUserModel>("User", userSchema);
