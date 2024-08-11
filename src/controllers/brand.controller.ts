import { Request, Response } from "express";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import APIFeatures from "../utils/APIFeatures";
import Brand from "../models/Brand.model";

export async function getAllBrand(req: Request, res: Response) {
  try {
    const query = (
      await new APIFeatures(Brand.find(), req.query, Brand).Validate()
    )
      .Filter()
      .Sort()
      .SkipAndLimit()
      .Fields();
    const allBrand = await query.getQuery;
    res.status(200).json({
      status: "success",
      results: allBrand.length,
      data: {
        brand: allBrand,
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

export async function getBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        brand,
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

export async function createBrand(req: Request, res: Response) {
  try {
    const newBrand = await Brand.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        brand: newBrand,
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

export async function updateBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateBrand) throw new Error("Data not found");

    res.status(201).json({
      status: "success",
      data: {
        brand: updateBrand,
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

export async function deleteBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new Error("Data not found");

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
