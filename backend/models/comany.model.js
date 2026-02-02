import mongoose from "mongoose";

const companySchema = new mongoose.Schema({

    name:{
        type:String,
        required:True
    },
    description:{
        type:String,
    },
    websites:{
        type:String
    },
    location: {
        type:String
    },
    logo:{
        type:String // url to company       
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true});

export const Job = mongoose.model("Job",companySchema);