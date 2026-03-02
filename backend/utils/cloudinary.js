/**
 * Cloudinary Configuration
 * Initializes the Cloudinary SDK using credentials from environment variables.
 * Used across controllers for profile photo, resume, and company logo uploads.
 */

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export default cloudinary;