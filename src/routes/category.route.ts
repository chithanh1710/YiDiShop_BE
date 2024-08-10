import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  importCategory,
  updateCategory,
} from "../controllers/category.controller";

const router = Router();

router.route("/import-all").get(importCategory);

router.route("/").get(getAllCategory).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
