import { Router } from "express";
import {
  checkImageLengthCreate,
  checkImageLengthUpdate,
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/product.controller";
import multer from "multer";
import path from "path";

// Cấu hình Multer để lưu trữ tệp
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/"); // Thư mục lưu trữ tệp
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên tệp
    },
  }),
});

const router = Router();

router
  .route("/")
  .get(getAllProduct)
  .post(
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    checkImageLengthCreate,
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .patch(
    upload.fields([{ name: "imageCover" }, { name: "images" }]),
    checkImageLengthUpdate,
    updateProduct
  )
  .delete(deleteProduct);

export default router;
