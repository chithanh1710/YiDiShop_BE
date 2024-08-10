import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReview,
  getReview,
  updateReview,
} from "../controllers/review.controller";

const router = Router();

router.route("/").get(getAllReview).post(createReview);

router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

export default router;
