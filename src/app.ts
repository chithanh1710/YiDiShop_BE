import express from "express";
import morgan from "morgan";

import {
  URL_CATEGORY,
  URL_ORDER,
  URL_PRODUCT,
  URL_USER,
} from "./constants/URL";

import productRouter from "./routes/product.route";
import categoryRouter from "./routes/category.route";
import userRouter from "./routes/user.route";
import orderRouter from "./routes/order.route";
const app = express();

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

export default app;
