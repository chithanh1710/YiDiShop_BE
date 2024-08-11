import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import Order from "../models/Order.model";

export async function getAllOrder(req: Request, res: Response) {
  try {
    const allOrder = await Order.find();
    res.status(200).json({
      status: "success",
      results: allOrder.length,
      data: {
        order: allOrder,
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

export async function getOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        order,
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

export async function createOrder(req: Request, res: Response) {
  try {
    const newOrder = await Order.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        order: newOrder,
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

export async function updateOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updateOrder) throw new Error("Data not found");

    res.status(201).json({
      status: "success",
      data: {
        order: updateOrder,
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

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new Error("Data not found");

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
