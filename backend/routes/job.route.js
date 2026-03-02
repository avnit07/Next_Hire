// Routes for job listings: posting, fetching all, and getting specific job details
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobBYId, postJob } from "../controllers/job.controller.js";

const router = express.Router();

// isAuthenticated ensures only logged-in recruiters can post jobs
router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
// Public route so guests can view job details without logging in
router.route("/get/:id").get(getJobBYId);

export default router;
