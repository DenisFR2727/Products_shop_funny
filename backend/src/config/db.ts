import mongoose from "mongoose";

import { env } from "./env.js";

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri);

  const connection = mongoose.connection;
  connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });
  connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  console.log(`MongoDB connected: ${connection.name}`);
}
