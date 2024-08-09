import mongoose from "mongoose";
import app from "./app";
import { config } from "dotenv";

config({
  path: "./config.env",
});

const DATABASE = process.env.__DATABASE?.replace(
  "<PASSWORD>",
  process.env.__DATABASE_PASSWORD || ""
);

if (!DATABASE) throw new Error("DATABASE NOT FOUND");

mongoose
  .connect(DATABASE, {
    dbName: "YiDiShop",
  })
  .then(() => {
    console.log("DATABASE connection successful!");
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
