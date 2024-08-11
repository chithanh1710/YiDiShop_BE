import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getOrder,
  updateOrder,
} from "../controllers/order.controller";

const router = Router();

router.route("/").get(getAllOrder).post(createOrder);

router.route("/:id").get(getOrder).patch(updateOrder).delete(deleteOrder);

export default router;
