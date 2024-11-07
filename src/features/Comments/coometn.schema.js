import mongoose from "mongoose";

//creating comment schema

export const commentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    comment:{
        type:String,
        required:true
    }
});