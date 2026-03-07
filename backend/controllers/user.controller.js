// Handles user authentication, registration, logout, and profile updates

import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Register a new user (student or recruiter) and hash their password securely
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email.", success: false });
        }

        let profilePhotoUrl = "";
        if (req.file) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: "image",
                });
                profilePhotoUrl = cloudResponse?.secure_url || "";
            } catch (cloudErr) {
                console.error("[Cloudinary] Profile photo upload failed:", cloudErr?.message || cloudErr);
                return res.status(500).json({
                    message: "Profile photo upload failed. Check Cloudinary configuration.",
                    success: false,
                });
            } finally {
                // Remove temp file after upload regardless of success or failure
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        // Auto-login: generate token and return user data so the frontend can skip the login page
        const token = await jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        const user = {
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            profile: newUser.profile,
        };

        return res.status(201).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'none',
            secure: 'true',
        }).json({ message: "Account created successfully.", user, token, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Authenticate user, generate a JWT token, and store it in an HTTP-only cookie
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "All fields are required.", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            // Unified message avoids leaking whether the email exists
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        // Prevent role mismatch — a recruiter cannot log in through the student portal and vice versa
        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Return only non-sensitive fields
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,          // Prevents JavaScript access to cookie
            sameSite: 'none',      // Mitigates CSRF attacks
            secure: 'true',
        }).json({ message: `Welcome back ${user.fullName}`, user, token, success: true });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Fetch the currently authenticated user's profile data using their token
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }
        const userObj = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };
        return res.status(200).json({ user: userObj, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Clear the authentication cookie to securely log the user out
export const logout = async (req, res) => {
    try {
        // Clear cookie by setting maxAge to 0
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: 'true',
        }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

// Update user profile details, including uploading a new resume or profile photo
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;

        const userId = req.id;
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ message: "User not found.", success: false });
        }

        // Skills arrive as a comma-separated string from the form
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",").map(s => s.trim());
        }

        // Support both single-file and multi-file upload configurations
        const resumeFile = req.file || (req.files && req.files.file ? req.files.file[0] : null);
        const profilePhotoFile = req.files && req.files.profilePhoto ? req.files.profilePhoto[0] : null;

        // Handle resume upload — delete previous version from Cloudinary before replacing
        if (resumeFile) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(resumeFile.path, {
                    resource_type: "raw",
                    access_mode: "public",
                });

                if (cloudResponse?.secure_url) {
                    if (user.profile.resume) {
                        try {
                            const parts = user.profile.resume.split("/");
                            const filename = parts[parts.length - 1];
                            const publicId = filename.split(".")[0];
                            if (publicId) await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
                        } catch (err) { /* Non-blocking: old file cleanup failure should not abort the update */ }
                    }
                    user.profile.resume = cloudResponse.secure_url;
                    user.profile.resumeOriginalName = resumeFile.originalname;
                }
            } catch (cloudErr) {
                console.error("[Cloudinary] Resume upload failed:", cloudErr?.message || cloudErr);
                return res.status(500).json({
                    message: "Resume upload failed. Check Cloudinary configuration.",
                    success: false,
                });
            } finally {
                if (fs.existsSync(resumeFile.path)) fs.unlinkSync(resumeFile.path);
            }
        }

        // Handle profile photo upload — delete previous version from Cloudinary before replacing
        if (profilePhotoFile) {
            try {
                const cloudResponse = await cloudinary.uploader.upload(profilePhotoFile.path, {
                    resource_type: "image",
                });

                if (cloudResponse?.secure_url) {
                    if (user.profile.profilePhoto) {
                        try {
                            const parts = user.profile.profilePhoto.split("/");
                            const filename = parts[parts.length - 1];
                            const publicId = filename.split(".")[0];
                            if (publicId) await cloudinary.uploader.destroy(publicId);
                        } catch (err) { /* Non-blocking */ }
                    }
                    user.profile.profilePhoto = cloudResponse.secure_url;
                }
            } catch (cloudErr) {
                console.error("[Cloudinary] Profile photo upload failed:", cloudErr?.message || cloudErr);
                return res.status(500).json({
                    message: "Profile photo upload failed. Check Cloudinary configuration.",
                    success: false,
                });
            } finally {
                if (fs.existsSync(profilePhotoFile.path)) fs.unlinkSync(profilePhotoFile.path);
            }
        }

        // Partial updates — only overwrite fields that are present in the request
        if (fullName) user.fullName = fullName;
        if (email) {
            // Ensure the new email isn't already taken by another account
            const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use by another account.", success: false });
            }
            user.email = email;
        }
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        await user.save();

        // Return only non-sensitive fields
        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({ message: "Profile updated successfully.", user, success: true });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}