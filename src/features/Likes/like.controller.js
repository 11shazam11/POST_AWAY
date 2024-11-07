import { LikeRepo } from "./like.repository.js";

//Like Controller
export class LikeController{
    //likeRepo instance
    constructor(){
        this.likeRepo = new LikeRepo;
    }

    //add like

    async likeAdd(req,res,next){
        try{
            let newLike = await this.likeRepo.addLike(req.userId,req.params.postId);
            return res.status(200).send(newLike);
        }catch(error){
            next(error); 
        }
    }
    
}