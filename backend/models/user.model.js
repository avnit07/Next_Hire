import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        requird:true
    },
     email:{
        type: String,
        requird:true,
        unique:true
    },
    phoneNumber:{
        type: Number,
        requird:true
    },
    password:{
        type:String,
        requird:true      
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'company'
        },
        profilePhoto:{
            type:String,
            default:""
        }
    },


},{timestamps:true});

export const User = mongoose.model('User', userSchema);