import mongoose from "mongoose";

//Post schema
export const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    caption:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    comment:Number,
    like:Number
});