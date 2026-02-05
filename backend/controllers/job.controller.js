import { Job } from "../models/job.model.js";
import "../models/application.model.js";

// job posting or creating 
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary,
            location, jobType, experience, position, companyId } = req.body;

        const userId = req.id;

        if (!title || !description || !requirements || !salary ||
            !location || !jobType || experience === undefined || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required",                
                success: false
            })
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements) ? requirements : requirements.split(','),
            salary: Number(salary),
            location,
            jobType,
            experience: Number(experience),
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// to filter the jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query)
            .populate({
                path: "company",
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// for student
export const getJobBYId = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "company"
            })
            .populate({
                path: "applications"
            });

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        };
        return res.status(200).json({
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// how many and which jobs created by the Admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({
                path: "company"
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

// Get jobs by specific company
export const getJobsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        
        const jobs = await Job.find({ company: companyId })
            .populate({ 
                path: "company"
            })
            .sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this company",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            company: jobs[0].company,
            totalJobs: jobs.length,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}