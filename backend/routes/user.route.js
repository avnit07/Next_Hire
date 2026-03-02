// Routes for user authentication and profile updates

import express from "express";
import { getMe, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, multiUpload } from "../middlewares/multer.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Limit auth attempts to prevent brute-force attacks on login/register
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many requests from this IP. Please try again after 15 minutes.", success: false }
});

router.route("/register").post(authLimiter, singleUpload, register);
router.route("/login").post(authLimiter, login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMe);
// singleUpload processes the profile photo on basic updates
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile);
// multiUpload processes both resume and profile photo simultaneously
router.route("/update").patch(isAuthenticated, multiUpload, updateProfile);

export default router;
