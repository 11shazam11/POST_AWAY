import mongoose from "mongoose";
import { likeSchema } from "./likes.schema.js";
import { postModel } from "../Post/post.repository.js";
import { ApplicationError } from "../error-handeler/application_error.js";

//Like Model 
export const likeModel = mongoose.model("Like",likeSchema);


//Like Repository
export class LikeRepo{
    //add Like 
    async addLike(userId,postId){
        try{
            let post = await postModel.findById(postId); //find POst
            if(!post) throw new ApplicationError("Post not found",404);
            //check if already liked 
            let existingLike = await likeModel.findOne({ userId: userId, postId: postId });
            if (existingLike) {
                // If a like exists, remove it (dislike)
                await likeModel.deleteOne({ _id: existingLike._id });
                return { success: true, msg: "Like removed successfully" };
            }
            //Add  Like
            let newLike = new likeModel({
                userId:userId,
                postId:postId
            });
            await newLike.save();
            await newLike.populate("postId")
            return {success:true,msg:"Post Likes Successfully",resp:newLike};
        }catch(error){
            throw error;
        }
    }

    //toggle like
    async toggleLike(userId,postId){
        try{

        }catch(error){
            throw error;
        }
    }
}