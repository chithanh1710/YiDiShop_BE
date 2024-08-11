import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrand,
  getBrand,
  updateBrand,
} from "../controllers/brand.controller";

const router = Router();

router.route("/").get(getAllBrand).post(createBrand);

router.route("/:id").get(getBrand).patch(updateBrand).delete(deleteBrand);

export default router;
