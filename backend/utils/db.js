// Handles MongoDB connection setup for the entire application

import mongoose from "mongoose";

// Connect to the database and exit the process if it fails to prevent running without DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

export default connectDB;