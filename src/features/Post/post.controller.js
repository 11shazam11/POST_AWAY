import { ApplicationError } from "../error-handeler/application_error.js";
import { PostRepo } from "./post.repository.js";

export class PostController{
    constructor(){
        this.postRepo = new PostRepo();
    }

    async addPost(req,res,next){
        try{
            if(!req.file){
                throw new ApplicationError("Please Upload a file",404);
            }else{
                let userId = req.userId;        //from jwt token
                let {caption} = req.body;
                let newPost = await this.postRepo.createPost(userId,caption,req.file);
                if(newPost.success){
                    return res.status(200).send(newPost);
                }
            }
        }catch(error){
            next(error);
        }
    }

    //Update Post
    async updatePost(req,res,next){
        try{
            let {caption} = req.body;
            let updatePost = await this.postRepo.updatePost(req.userId,req.params.postId,caption,req.file);
            return res.status(200).send(updatePost);

        }catch(error){
            next(error);
        }
    }
    
    //Delete Post

    async delete(req,res,next){
        try{
            let deleted = await this.postRepo.deletePost(req.userId,req.params.postId);
            return res.status(200).send(deleted);
        }catch(error){
            next(error);
        }
    }

    //getAll Post
    async getAllPost(req,res,next){
        try{
            let posts = await this.postRepo.allPost();
            return res.status(200).send(posts);
        }catch(error){
            next(error);
        }
    }
    //get ONe post
    async getOne(req,res,next){
        try{
            let post = await this.postRepo.getOnePost(req.params.postId);
            return res.status(200).send(post);
        }catch(error){
            next(error);
        }
    }
    //get user post
    async getUserPost(req,res,next){
        try{
            let userPost = await this.postRepo.userPost(req.userId);
            return res.send(200).send(userPost);
        }catch(error){
            next(error);
        }
    }
    //Get Likes and Comments
    async getLikesandComments(req,res,next){
        try{
            let likesComments = await this.postRepo.likesAndComments(req.params.postId);
            return res.status(200).send(likesComments);
        }catch(error){
            next(error);
        }
    }
}