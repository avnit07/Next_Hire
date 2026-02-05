import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postJob, getAdminJobs, getAllJobs, getJobBYId , getJobsByCompany} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.route("/get").get(isAuthenticated,getAllJobs);
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);
router.route("/company/:companyId").get(getJobsByCompany);
router.route("/get/:id").get(isAuthenticated,getJobBYId);

export default router;
