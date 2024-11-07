import { CommentRepo } from "./comment.repository.js";

export class CommentController{
    constructor(){
        this.commentRepo = new CommentRepo;
    }

    //adding Comment
    async commentAdd(req,res,next){
        try{
            let {comment} =  req.body;
            let newcomment = await this.commentRepo.addComment(req.userId,req.params.postId,comment);
            return res.status(200).send(newcomment);
        }catch(error){
            next(error);
        }
    }
    
    //Update comment
    async commentUpdate(req,res,next){
        try{
            let {comment} = req.body;
            let newComment = await this.commentRepo.updateComment(req.userId,req.params.commentId,comment);
            return res.status(200).send(newComment);
        }catch(error){
            next(error);
        }
    }

    async commentDelete(req,res,next){
        try{
            let deleted = await this.commentRepo.deleteComment(req.userId,req.params.commentId);
            return res.status(200).send(deleted);
        }catch(error){
            next(error);
        }
    }

    //Get post comment
    async postComment(req,res,next){
        try{
            let comments = await this.commentRepo.getComments(req.params.postId);
            return res.status(200).send(comments);
        }catch(error){
            next(error);
        }
    }
}