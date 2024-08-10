import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config({
  path: "./config.env",
});

cloudinary.config({
  cloud_name: process.env.__API_CLOUDNAME_CLOUDINARY,
  api_key: process.env.__API_KEY_CLOUDINARY,
  api_secret: process.env.__API_SECRET_CLOUDINARY,
});

export default cloudinary;
