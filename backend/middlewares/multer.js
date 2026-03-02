// Configures disk storage for file uploads to handle large resumes and photos without crashing memory

import multer from "multer";
import fs from "fs";

const uploadDir = "./temp/uploads";

// Ensure the upload directory exists at startup
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Prefix with timestamp to avoid filename collisions
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Single-file upload (used for profile photo on registration)
export const singleUpload = multer({ storage }).single("file");

// Multi-file upload (used for profile update — resume + profile photo simultaneously)
export const multiUpload = multer({ storage }).fields([
    { name: "file", maxCount: 1 },
    { name: "profilePhoto", maxCount: 1 }
]);