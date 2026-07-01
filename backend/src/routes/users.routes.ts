import { Router } from "express";

import {
  createUser,
  getUsers,
  updateUser,
} from "../controllers/users.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const usersRouter = Router();

usersRouter.get("/", asyncHandler(getUsers));
usersRouter.post("/", asyncHandler(createUser));
usersRouter.put("/:id", asyncHandler(updateUser));
