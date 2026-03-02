// Manages job applications: applying, retrieving applied jobs, and updating statuses

import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Allow a student to apply for a job, ensuring they haven't applied twice
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ message: "Job id is required.", success: false });
        }

        // Only students (job seekers) can apply — recruiters cannot apply to their own listings
        const user = await User.findById(userId).select("role");
        if (user?.role !== "student") {
            return res.status(403).json({ message: "Only students can apply for jobs.", success: false });
        }

        // Prevent duplicate applications at the database level
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job.", success: false });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        await Application.create({ job: jobId, applicant: userId });

        return res.status(201).json({ message: "Job applied successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Fetch all jobs the current student has applied to, including company details
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Two-level populate: Application → Job → Company
        const application = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'job',
                populate: { path: 'company' },
            });

        const totalApplications = await Application.countDocuments({ applicant: userId });

        return res.status(200).json({
            application: application || [],
            totalApplications,
            currentPage: page,
            totalPages: Math.ceil(totalApplications / limit),
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch all applicants for a specific job so the recruiter can review them
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: "Job not found.", success: false });
        }

        // Authorization: recruiter can only view applicants for jobs they created
        if (job.created_by?.toString() !== req.id.toString()) {
            return res.status(403).json({ message: "You can only view applicants for your own jobs.", success: false });
        }

        // Applications are stored separately from the Job document to keep job data lean
        const applications = await Application.find({ job: jobId })
            .sort({ createdAt: -1 })
            .populate({ path: 'applicant', select: '-password' });

        return res.status(200).json({
            job: { ...job.toObject(), applications },
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Update the status of an application (e.g., accepted, rejected) by the job owner
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required.", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        // Authorization: only the recruiter who posted the job can update its application statuses
        const job = await Job.findById(application.job).select("created_by");
        if (!job || job.created_by.toString() !== req.id.toString()) {
            return res.status(403).json({ message: "You can only update applications for your own jobs.", success: false });
        }

        // Normalize and validate status to prevent arbitrary values in the database
        const normalizedStatus = status.toLowerCase();
        const allowedStatuses = ["pending", "accepted", "rejected"];
        if (!allowedStatuses.includes(normalizedStatus)) {
            return res.status(400).json({ message: "Invalid status value.", success: false });
        }

        application.status = normalizedStatus;
        await application.save();

        return res.status(200).json({ message: "Status updated successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}