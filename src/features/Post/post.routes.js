import express, { raw } from "express";
import { fileUpload } from "../../middlewares/fileUpload.js";
import { PostController } from "./post.controller.js";

const postController = new PostController();

const postRoutes = express.Router();

//Add post
postRoutes.post("/",fileUpload.single("image"),(req,res,next)=>{
    postController.addPost(req,res,next);
});
//Update post
postRoutes.put("/:postId",fileUpload.single("image"),(req,res,next)=>{
    postController.updatePost(req,res,next);
})
//delete post
postRoutes.delete("/:postId",(req,res,next)=>{
    postController.delete(req,res,next);
});
//get all post
postRoutes.get("/all",(req,res,next)=>{
    postController.getAllPost(req,res,next);
})
//get one post
postRoutes.get("/:postId",(req,res,next)=>{
    postController.getOne(req,res,next);
});
//get user Posts
postRoutes.get("/",(req,res,next)=>{
    postController.getUserPost(req,res,next);
})
//get Likes and comments
postRoutes.get("/likesComments/:postId",(req,res,next)=>{
    postController.getLikesandComments(req,res,next);
})


export default postRoutes;