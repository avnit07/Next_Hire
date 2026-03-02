// Defines the Company schema to store recruiter's company details for job postings

import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        // Ensure no duplicate company names across the platform
        unique: true
    },
    description: { type: String },
    website: { type: String },
    location: { type: String },
    logo: { type: String },       // Cloudinary URL of the company logo
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export const Company = mongoose.model("Company", companySchema);