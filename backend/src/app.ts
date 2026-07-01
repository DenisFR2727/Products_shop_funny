import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { usersRouter } from "./routes/users.routes.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/users", usersRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
