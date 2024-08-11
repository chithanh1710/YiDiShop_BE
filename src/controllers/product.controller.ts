import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import Product from "../models/Product.model";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import APIFeatures from "../utils/APIFeatures";
import Category from "../models/Category.model";
import cloudinary from "../lib/cloudinary";

export function checkImageLengthCreate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.files &&
    (req.files as any)["imageCover"].length === 1 &&
    (req.files as any)["images"].length > 0 &&
    (req.files as any)["images"].length <= 3
  )
    next();
  else {
    res.status(400).json({
      status: "fail",
      message: "Invalid data send",
      imageCover: `${(req.files as any)["imageCover"].length} === 1 ${
        (req.files as any)["imageCover"].length === 1
      }`,
      images: `0 < ${(req.files as any)["images"].length} <= 3 ${
        (req.files as any)["imageCover"].length > 0 &&
        (req.files as any)["imageCover"].length <= 3
      }`,
    });
  }
}

export function checkImageLengthUpdate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    req.files &&
    (((req.files as any)["imageCover"] &&
      (req.files as any)["imageCover"].length === 1) ||
      ((req.files as any)["images"] &&
        (req.files as any)["images"].length > 0 &&
        (req.files as any)["images"].length <= 3))
  )
    next();
  else {
    res.status(400).json({
      status: "fail",
      message: "Invalid data send",
      imageCover: `${(req.files as any)["imageCover"].length} === 1 ${
        (req.files as any)["imageCover"].length === 1
      }`,
      images: `0 < ${(req.files as any)["images"].length} <= 3 ${
        (req.files as any)["imageCover"].length > 0 &&
        (req.files as any)["imageCover"].length <= 3
      }`,
    });
  }
}

export async function getAllProduct(req: Request, res: Response) {
  try {
    const query = (
      await new APIFeatures(Product.find(), req.query, Product).Validate()
    )
      .Filter()
      .Sort()
      .SkipAndLimit()
      .Fields();
    const allProduct = await query.getQuery;
    res.status(200).json({
      status: "success",
      results: allProduct.length,
      data: {
        product: allProduct,
      },
    });
  } catch (error: any) {
    const { message, ...err } = error;
    res.status(400).json({
      status: "fail",
      message: "Invalid data send",
      error: {
        message,
        err,
      },
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error: any) {
    const { message, ...err } = error;
    res.status(400).json({
      status: "fail",
      message: "Invalid data send",
      error: {
        message,
        err,
      },
    });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    let imageCoverUrl: string | undefined;
    if (req.files && (req.files as any)["imageCover"]) {
      const imageCover = (req.files as any)["imageCover"][0];
      const result = await cloudinary.uploader.upload(imageCover.path, {
        folder: "products/covers",
      });
      imageCoverUrl = result.secure_url;
      fs.unlinkSync(imageCover.path); // Xóa file tạm sau khi upload
    }

    const imageUrls: string[] = [];
    if (req.files && (req.files as any)["images"]) {
      const images = (req.files as any)["images"] as Express.Multer.File[];
      for (const file of images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products/images",
        });
        imageUrls.push(result.secure_url);
        fs.unlinkSync(file.path); // Xóa file tạm sau khi upload
      }
    }

    const newProduct = await Product.create({
      ...req.body,
      imageCover: imageCoverUrl,
      images: imageUrls,
    });

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error: any) {
    const { message, ...err } = error;
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
      error: {
        message,
        err,
      },
    });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const oldProduct = await Product.findById(id);
    if (!oldProduct) throw new Error("Data not found");

    let imageCoverUrl: string | undefined;
    if (req.files && (req.files as any)["imageCover"]) {
      const imageCover = (req.files as any)["imageCover"][0];
      const result = await cloudinary.uploader.upload(imageCover.path, {
        folder: "products/covers",
      });
      imageCoverUrl = result.secure_url;

      // Xóa ảnh cũ nếu có
      if (oldProduct.imageCover) {
        const publicId = oldProduct.imageCover.split("/").pop()?.split(".")[0];
        if (publicId) {
          await cloudinary.uploader.destroy(`products/covers/${publicId}`);
        }
      }
      fs.unlinkSync(imageCover.path);
    }

    const imageUrls: string[] = [];
    if (req.files && (req.files as any)["images"]) {
      const images = (req.files as any)["images"] as Express.Multer.File[];
      for (const file of images) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products/images",
        });
        imageUrls.push(result.secure_url);

        if (oldProduct.images) {
          for (const oldImage of oldProduct.images) {
            const publicId = oldImage.split("/").pop()?.split(".")[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`products/images/${publicId}`);
            }
          }
        }
        fs.unlinkSync(file.path);
      }
    }

    const updateProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        imageCover: imageCoverUrl || oldProduct.imageCover,
        images: imageUrls.length ? imageUrls : oldProduct.images,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateProduct) throw new Error("Data not found");

    // Xoá sản phẩm ở thể loại cũ
    await Category.updateOne(
      { _id: oldProduct.category }, // bảng cũ
      { $inc: { numProduct: -1 }, $pull: { products: oldProduct._id } }
    );

    // Thêm sản phẩm ở thể loại mới
    await Category.updateOne(
      { _id: updateProduct.category }, // bảng mới
      { $inc: { numProduct: 1 }, $addToSet: { products: updateProduct._id } }
    );

    res.status(201).json({
      status: "success",
      data: {
        product: updateProduct,
      },
    });
  } catch (error: any) {
    const { message, ...err } = error;
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
      error: {
        message,
        err,
      },
    });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    const imagesId = product?.images?.map(
      (val) => val.split("/").pop()?.split(".")[0]
    );

    const imageCoverId = product?.imageCover.split("/").pop()?.split(".")[0];

    if (!imagesId || !imageCoverId) throw new Error("Data not found");

    await cloudinary.uploader.destroy(`products/covers/${imageCoverId}`);

    for (const publicId of imagesId) {
      await cloudinary.uploader.destroy(`products/images/${publicId}`);
    }

    if (!product) throw new Error("Data not found");

    await Category.updateOne(
      { _id: product.category },
      { $inc: { numProduct: -1 }, $pull: { products: product._id } }
    );

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error: any) {
    const { message, ...err } = error;
    res.status(400).json({
      status: "fail",
      message: "Invalid data send",
      error: {
        message,
        err,
      },
    });
  }
}
