import { Request, Response } from "express";
import Review from "../models/Review.model"; // Import model Review

// Controller để lấy tất cả các Review
export async function getAllReview(req: Request, res: Response) {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: {
        reviews,
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

// Controller để lấy một Review theo ID
export async function getReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new Error("Review not found");

    res.status(200).json({
      status: "success",
      data: {
        review,
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

// Controller để tạo mới một Review
export async function createReview(req: Request, res: Response) {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview,
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

// Controller để cập nhật một Review theo ID
export async function updateReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReview) throw new Error("Review not found");

    res.status(200).json({
      status: "success",
      data: {
        review: updatedReview,
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

// Controller để xóa một Review theo ID
export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) throw new Error("Review not found");

    res.status(204).json({
      status: "success",
      data: null,
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
