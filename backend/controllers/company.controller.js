// Handles company operations: registration, fetching, and updating details for recruiters

import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Register a new company for the logged-in recruiter
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "A company with this name is already registered.",
                success: false
            });
        }

        const newCompany = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company: newCompany,
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch all companies owned by the current recruiter
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });

        // find() returns an empty array, not null — check length explicitly
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            });
        }

        return res.status(200).json({ companies, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch details of a single company by its ID
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({ company, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Update company details and optionally upload a new logo to Cloudinary
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const updateData = { name, description, website, location };

        if (req.file) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "image",
                });
                updateData.logo = cloudResponse?.secure_url;
            } catch (cloudErr) {
                console.error("[Cloudinary] Logo upload failed:", cloudErr?.message || cloudErr);
                return res.status(500).json({
                    message: "Logo upload failed. Check Cloudinary configuration.",
                    success: false,
                });
            } finally {
                // Remove temp file after upload regardless of outcome
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
        }

        // Authorization: verify the recruiter owns this company before allowing updates
        const existingCompany = await Company.findById(req.params.id).select("userId");
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }
        if (existingCompany.userId.toString() !== req.id.toString()) {
            return res.status(403).json({
                message: "You can only update companies you own.",
                success: false
            });
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({ message: "Company not found.", success: false });
        }

        return res.status(200).json({ message: "Company information updated.", success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}