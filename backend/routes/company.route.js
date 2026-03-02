// Routes for company management: registering and updating company profiles
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// isAuthenticated ensures only logged-in recruiters can manage companies
router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
// singleUpload handles the multipart form data for the company logo image
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;
