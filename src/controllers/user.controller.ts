import { NextFunction, Request, Response } from "express";
import { __PAGE_DEFAULT, __PAGE_LIMIT } from "../constants/PAGE";
import User from "../models/User.model";

export async function checkUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.params;
    const { password } = req.body;

    if (!password) throw new Error("Invalid data send");

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("User not found");

    const checkPass = await user.correctPassword(
      req.body.password,
      user.password
    );

    if (!checkPass) throw new Error("Incorrect email or password");

    next();
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

export async function getAllUser(req: Request, res: Response) {
  try {
    const allUser = await User.find().select("-__v");
    res.status(200).json({
      status: "success",
      results: allUser.length,
      data: {
        user: allUser,
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

export async function getUser(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json({
      status: "success",
      data: {
        user,
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

export async function createUser(req: Request, res: Response) {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
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

export async function updateUser(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const { data } = req.body;
    const updateUser = await User.findOneAndUpdate({ email }, data, {
      new: true,
      runValidators: true,
    });

    if (!updateUser) throw new Error("Data not found");

    res.status(201).json({
      status: "success",
      data: {
        user: updateUser,
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

export async function deleteUser(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
    if (!user) throw new Error("Data not found");

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
