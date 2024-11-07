import mongoose from "mongoose";

//Like Schema
export const likeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
});