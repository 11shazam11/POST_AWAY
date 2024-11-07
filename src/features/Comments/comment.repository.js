import mongoose from "mongoose";

import { commentSchema } from "./coometn.schema.js";
import { ApplicationError } from "../error-handeler/application_error.js";

//Comment Model
export const commentModel = mongoose.model("Comment",commentSchema);

export class CommentRepo {

    //Add comment repo
    async addComment(userId,postId,comment){
        try{
            //add commetn
            let newComment = new commentModel({
                userId:userId,
                postId:postId,
                comment:comment
            });
            //save comment
            await newComment.save();
            await newComment.populate("postId");
            return {success:true,msg:"Comment added Successfully",resp:newComment};
        }catch(error){
            throw error;
        }
    }

    //Commemt Update
    async updateComment(userId,commentId,newcomment){
        try{
            //find Comment
            let updatecomment = await commentModel.findById(commentId);
            if(!updatecomment) throw new ApplicationError("Commemt Not found",404);
            //Authenticate user
            if(updatecomment.userId.toString() != userId) throw new ApplicationError("Cannot Update other's Comment",403);
            //update comment
            updatecomment.comment = newcomment;
            await updatecomment.save();
            return {success:true,msg:"Comment updated successfully",resp:updatecomment};
        }catch(error){
            throw error;
        }
    }

    //Delete Comment
    async deleteComment(userId,commentId){
        try{
            let delcomment = await commentModel.findById(commentId);
            //Find comment
            if(!delcomment) throw new ApplicationError("Commemt Not found",404);
            //Aunthenticate User
            if(delcomment.userId.toString() != userId) throw new ApplicationError("Cannot Update other's Comment",403);
            //Delete Comment
            await commentModel.deleteOne({_id:commentId});
            return {success:true,msg:"Comment deleted successfully",resp:delcomment};
        }catch(error){
            throw error;
        }
    }

    //get comments of a post
    async getComments(postId){
        try{
            let allComments = await commentModel.find({postId:postId},{postId:0}).populate("userId","name");
            if(!allComments) return {success:true,msg:"No comments yet"};
            return {success:true,resp:allComments};
        }catch(error){
            throw error;
        }
    }

}