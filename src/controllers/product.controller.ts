import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Product from "../models/Product.model";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import APIFeatures from "../utils/APIFeatures";
import Category from "../models/Category.model";

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

export async function importProduct(req: Request, res: Response) {
  try {
    const filePath = path.join(__dirname, "../../DATA_TEST_PRODUCT.json");
    const dataList = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    await Product.deleteMany();
    await Category.updateMany({ products: [], numProduct: 0 });
    await Product.create(dataList);

    res.status(200).json({
      status: "success",
      requestedAt: new Date(),
      results: dataList.length,
      data: {
        product: dataList,
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
    const newProduct = await Product.create(req.body);

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
      message: "Invalid data send",
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

    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
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
      message: "Invalid data send",
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
