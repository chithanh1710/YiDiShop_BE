import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import APIFeatures from "../utils/APIFeatures";
import Category from "../models/Category.model";

export async function getAllCategory(req: Request, res: Response) {
  try {
    const query = (
      await new APIFeatures(Category.find(), req.query, Category).Validate()
    )
      .Filter()
      .Sort()
      .SkipAndLimit()
      .Fields();
    const allCategory = await query.getQuery;
    res.status(200).json({
      status: "success",
      results: allCategory.length,
      data: {
        category: allCategory,
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

export async function getCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        category,
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

export async function createCategory(req: Request, res: Response) {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
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

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateCategory) throw new Error("Data not found");

    res.status(201).json({
      status: "success",
      data: {
        category: updateCategory,
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

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error("Data not found");

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
