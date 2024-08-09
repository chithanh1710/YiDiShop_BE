import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  importProduct,
  updateProduct,
} from "../controllers/product.controler";

const router = Router();

router.route("/import-all").get(importProduct);

router.route("/").get(getAllProduct).post(createProduct);

router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

export default router;
