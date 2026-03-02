// Defines the Job schema to store job listings and enables text-based searching

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{ type: String }],
    salary: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

// Text index on title and description to enable fast keyword search instead of slow regex
jobSchema.index({ title: 'text', description: 'text' });

export const Job = mongoose.model("Job", jobSchema);