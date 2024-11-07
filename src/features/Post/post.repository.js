import mongoose from "mongoose";
//Post Schema
import { postSchema } from "./post.schema.js";
import { likeModel } from "../Likes/like.repository.js";
import { commentModel } from "../Comments/comment.repository.js";
import { ApplicationError } from "../error-handeler/application_error.js";

//creating post MOdel
export const postModel = mongoose.model("Post",postSchema);

//Post repository
export class PostRepo{

    //Create new Post
    async createPost(userId,caption,file){
        try{
            //file name 
            let imgaeUrl = `/uploads/${file.filename}`;      //Get the image URL

            //create new Post
            const newPost = new postModel({
                userId:new mongoose.Types.ObjectId(userId),
                caption:caption,
                content:imgaeUrl
            });
            await newPost.save();
            return {success:true,msg:"Post created Successfully",post:newPost};
        }catch(error){
            throw error;
        }
    }

    //udate post
    async updatePost(userId,postId,caption,file){
        try{
            let post = await postModel.findById(postId);

            if(!post) throw new ApplicationError("Post not found",404);     //find post

            //Check if it is the user post
            if(post.userId.toString() !== userId) throw new ApplicationError("Only Post Owner can update",403);
            post.caption = caption;
            post.content = `/uploads/${file.filename}`;
            await post.save();
            return {success:true,msg:"Updated Successfully",resp:post};
        }catch(error){
            throw error;
        }
    }

    //Delete Post
    async deletePost(userId,postId){
        try{
            let post = await postModel.findById(postId);        //Find POst
            if(!post) throw new ApplicationError("Post Does not Exsist",404);
            if(post.userId.toString() != userId) throw new ApplicationError("Post not your to Delete",403); //user not authorize to delete
            await postModel.deleteOne({_id:new mongoose.Types.ObjectId(postId)});
            return {success:true,msg:"Post Deleted Successfully",resp:post};
        }catch(error){
            throw error;
        }
    }

    //get All post
    async allPost(){
        try{
            let allpost = await postModel.find();
            return {success:true,resp:allpost};
        }catch(error){
            throw error;
        }
    }

    //get One post
    async getOnePost(postId){
        try{
            let post = await postModel.findById(postId);
            if(!post) throw new ApplicationError("POst not found",404);
            return {success:true,resp:post};
        }catch(error){
            throw error;
        }
    }

    //get all post of user
    async userPost(userId){
        try{
            let post = await postModel.find({userId:userId});
            if(!post) return {success:false,msg:"No posts yet"};
            return {success:true,posts:post}
        }catch(error){
            throw error;
        }
    }
    //Display likes and comments
    async likesAndComments(postId){
        try{
            let post = await postModel.findById(postId);
            if(!post) throw new ApplicationError("Post Does not Exists",404);       //Find Post

            let allcomments = await commentModel.find({postId:postId},{postId:0,_id:0}).populate({
                path:"userId",
                select:"name"
            });                                                                         //Check comments array

            let allLikes = await likeModel.find({postId:postId},{postId:0,_id:0}).populate({
                path:"userId",
                select:"name"
            });                                             //Check Likes Array

            console.log(allLikes,allcomments);
            post.comment = allcomments.length;
            post.like = allLikes.length;
            await post.save();
            return {success:true,msg:"Likes and Comments are Displayed",resp:{
                comments:{
                    total:post.comment,
                    comments:allcomments
                },
                likes:{
                    total:post.like,
                    likes:allLikes
                }
            }};
        }catch(error){
            throw error;
        }
    }
}