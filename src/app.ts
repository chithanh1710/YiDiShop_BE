import express from "express";
import morgan from "morgan";
import productRouter from "./routes/product.route";
import { URL_CATEGORY, URL_PRODUCT } from "./constants/URL";
import categoryRouter from "./routes/category.route";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.use(URL_PRODUCT, productRouter);
app.use(URL_CATEGORY, categoryRouter);

export default app;
