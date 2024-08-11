import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";

const router = Router();

router.route("/").get(getAllCategory).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
