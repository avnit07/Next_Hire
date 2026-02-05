import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;

        // validation
        if (!fullName || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // user already exist
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "User already exist with this email ",
                success: false,
            });
        }

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        await User.create({
            fullName,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
        });

    } catch (error) {
        console.error("Error in register:", error);

        return res.status(500).json({
            message: "Something went wrong. Please try again.",
            success: false
        });
    }
};

// Login user

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // validate
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // checking user exist or not
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "user does not exist",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account does not exist with current role",
                success: false,
            });
        }

        // Create payload
        const tokenData = {
            userId: user._id,
        };

        // Generate JWT token with 1-day expiry
        const token = await jwt.sign(
            tokenData,
            process.env.SECRET_KEY,
            {
                expiresIn:
                    "1d",
            }
        );


        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        // sending token to client 
        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            .json({
                message: `Welcome back ${user.fullName}`,
                user,
                success: true,
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}

// logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Logout failed",
            success: false
        });
    }
}

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // cloudinary will be here
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",")
        }

        const userId = req.id; // middleware Authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // updating data
        if (fullName) user.fullName = fullName
        if (email) user.email = email
        if (phoneNumber) user.phoneNumber = phoneNumber
        if (bio) user.profile.bio = bio
        if (skills) user.profile.skills = skillsArray




        // we will add resume section later with cloudinary

        await user.save();

        user = {
            _id: user._id,
            fullName: user.fullName,
            email: email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).json({
            message: "Profile updated successsfully",
            user,
            success: true
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Profile update failed",
            success: false
        });
    }
}