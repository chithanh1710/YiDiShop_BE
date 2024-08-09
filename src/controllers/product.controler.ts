import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Product from "../models/Product.model";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import APIFeatures from "../utils/APIFeatures";

export async function getAllProduct(req: Request, res: Response) {
  try {
    const query = (await new APIFeatures(Product.find(), req.query).Validate())
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
    await Product.create(dataList);

    res.status(200).json({
      status: "success",
      requestedAt: Date.now(),
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
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateProduct) throw new Error("Data not found");

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
