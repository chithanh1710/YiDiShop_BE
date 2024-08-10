import { Router } from "express";
import {
  checkUser,
  createUser,
  deleteUser,
  getAllUser,
  getUser,
  updateUser,
} from "../controllers/user.controller";

const router = Router();

router.route("/").get(getAllUser).post(createUser);

router
  .route("/:email")
  .all(checkUser)
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
