import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phoneNumber: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },

    profile: {
        bio: {
            type: String
        },

        skills: {
            type: [String],
            lowercase: true,
            trim: true,
            validate: {
                validator: function (arr) {
                    return arr.length <= 50;
                },
                message: 'Maximum 50 skills allowed'
            }
        },

        resume: {
            url: {
                type: String
            },
            publicId: {
                type: String
            },
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        },

        profilePhoto: {
            type: String,
            default: ""
        }
    }

}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
