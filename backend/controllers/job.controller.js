// Manages job postings, fetching with filters/pagination, and retrieving job details

import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

// Create a new job listing under the recruiter's company
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        // Authorization: verify the recruiter owns the company they are posting for
        const company = await Company.findById(companyId).select("userId");
        if (!company || company.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                message: "You can only post jobs for companies you own.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experience: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch all jobs with search, filtering, and sorting capabilities for students
export const getAllJobs = async (req, res) => {
    try {
        const { keyword, location, salary, type, sort, page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build AND conditions dynamically based on provided filters
        const andConditions = [];

        if (keyword && typeof keyword === 'string') {
            // $text search uses the compound text index on (title, description).
            // More efficient than $regex — avoids full collection scans.
            andConditions.push({
                $text: { $search: keyword }
            });
        }

        if (location) {
            andConditions.push({ location: { $regex: location, $options: 'i' } });
        }

        if (type) {
            andConditions.push({ jobType: { $regex: type, $options: 'i' } });
        }

        if (salary) {
            if (salary === "0-40k") andConditions.push({ salary: { $lte: 40000 } });
            else if (salary === "42-1lakh") andConditions.push({ salary: { $gte: 42000, $lte: 100000 } });
            else if (salary === "1lakh to 5lakh") andConditions.push({ salary: { $gte: 100000, $lte: 500000 } });
        }

        const query = andConditions.length > 0 ? { $and: andConditions } : {};

        let jobsQuery = Job.find(query)
            .populate({ path: "company" })
            .skip(skip)
            .limit(limitNum);

        // Sort strategy: relevance uses MongoDB textScore metadata when a keyword is present
        if (sort === "salary_desc") {
            jobsQuery = jobsQuery.sort({ salary: -1, createdAt: -1 });
        } else if (sort === "relevance" && keyword) {
            jobsQuery = jobsQuery.sort({ score: { $meta: "textScore" }, createdAt: -1 });
        } else if (sort === "latest") {
            jobsQuery = jobsQuery.sort({ createdAt: -1 });
        } else {
            // Default: relevance when keyword is present, otherwise latest first
            if (keyword) {
                jobsQuery = jobsQuery.sort({ score: { $meta: "textScore" }, createdAt: -1 });
            } else {
                jobsQuery = jobsQuery.sort({ createdAt: -1 });
            }
        }

        const jobs = await jobsQuery;
        const totalCount = await Job.countDocuments(query);

        return res.status(200).json({
            jobs,
            totalCount,
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            success: true
        });
    } catch (error) {
        console.error("Job Search Error:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch detailed information for a specific job, viewable by anyone
export const getJobBYId = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({ path: "company" });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // Applications are stored in a separate collection and fetched separately
        // to keep the Job document lean and avoid unbounded array growth
        const applications = await Application.find({ job: jobId });

        return res.status(200).json({ job: { ...job.toObject(), applications }, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch only the jobs posted by the currently logged-in recruiter for their dashboard
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalJobs = await Job.countDocuments({ created_by: adminId });

        return res.status(200).json({
            jobs,
            totalJobs,
            currentPage: page,
            totalPages: Math.ceil(totalJobs / limit),
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch all jobs posted by a specific company to show on the company's public profile
export const getJobsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const jobs = await Job.find({ company: companyId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });

        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}