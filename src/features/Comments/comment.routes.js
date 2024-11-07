import express from "express";
import { CommentController } from "./comment.controller.js";

//Comment Route
const commetnRoute = express.Router();

//commetn controller Instance 
const commentController = new CommentController();

//add comment 
commetnRoute.post("/:postId",(req,res,next)=>{
    commentController.commentAdd(req,res,next);
});

//update Comment
commetnRoute.put("/:commentId",(req,res,next)=>{
    commentController.commentUpdate(req,res,next);
});

//delete comment
commetnRoute.delete("/:commentId",(req,res,next)=>{
    commentController.commentDelete(req,res,next);
})

//get comments
commetnRoute.get("/:postId",(req,res,next)=>{
    commentController.postComment(req,res.next);
})

export default commetnRoute;