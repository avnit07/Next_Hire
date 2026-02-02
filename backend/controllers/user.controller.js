import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password, role } = req.body;
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
        const hashedPassword = await bcrypt.hash(password, 10);

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
        console.log(error);
    }
};

// Login user

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        // checking user exist or not
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
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

        // Payload data stored inside JWT
        const tokenData = {
            userId: user._id,
        };

        // Generate JWT token with 1-day expiry
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });


        user = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        }

        return res.status(200).cookie("token", token, {
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
        console.log(error);
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
        console.log(e);
    }
}

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        if (!fullName || !email || !phoneNumber || !bio || !skills) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        };

        // cloudinary will be here

        const skillsArray = skills.split(",")
        const userId = req.id; // middleware Authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        // updating data
        user.fullName = fullName,
            user.email = email,
            user.phoneNumber = phoneNumber,
            user.profile.bio = bio,
            user.profile.skills = skillsArray

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
    }
}
