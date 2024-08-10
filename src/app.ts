import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";

config({
  path: "./config.env",
});

import {
  URL_CATEGORY,
  URL_ORDER,
  URL_PRODUCT,
  URL_REVIEW,
  URL_USER,
} from "./constants/URL";

import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import userRouter from "./routes/user.route";
import orderRouter from "./routes/order.route";
import reviewRouter from "./routes/review.route";
const app = express();
const allowedOrigins = ["https://your-allowed-domain.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use(URL_PRODUCT, productRouter);
app.use(URL_CATEGORY, categoryRouter);
app.use(URL_USER, userRouter);
app.use(URL_ORDER, orderRouter);
app.use(URL_REVIEW, reviewRouter);

export default app;
