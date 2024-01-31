import mongoose from "mongoose";
import env from "./env";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DB_URI);

    mongoose.set("toJSON", {
      virtuals: true,
      versionKey: false,
      transform: (_doc, converted) => {
        delete converted._id;
      },
    });

    console.warn(
      `Conntected to ${env.ENV} database! ${
        env.DB_URI === "production" ? "⛔️" : "⚠️"
      }`,
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
  }
};
