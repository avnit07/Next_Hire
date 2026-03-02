/**
 * Express App Entry Point
 * Configures middleware, CORS, routes, and starts the server.
 * Environment variables are loaded relative to this file's directory
 * to support running from any working directory.
 */

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import errorHandler from "./middlewares/errorHandler.js";

// Resolve __dirname for ES module context
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: (origin, cb) => {
        // Allow requests from configured frontend origins.
        // Supports multiple origins via comma-separated FRONTEND_URL env variable.
        const allowed = process.env.FRONTEND_URL
            ? process.env.FRONTEND_URL.split(',')
            : [
                'http://localhost:5173',
                'http://localhost:5174',
                'http://localhost:5175',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:5174',
                'http://127.0.0.1:5175'
            ];

        if (!origin || allowed.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Global error handler must be registered after all routes
app.use(errorHandler);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});