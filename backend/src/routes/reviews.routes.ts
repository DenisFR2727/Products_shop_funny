import { Router } from "express";

import { createReview, getReviews } from "../controllers/reviews.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const reviewsRouter = Router();

reviewsRouter.get("/", asyncHandler(getReviews));
reviewsRouter.post("/", asyncHandler(createReview));
