import { FriendRepo } from "./friend.repository.js";

export class FriendController{
    //friend Repo instace
    constructor(){
        this.friendRepo = new FriendRepo();
    }

    //Send or cancel Request
    async sendRequest(req,res,next){
        try{
            let request = await this.friendRepo.addFriend(req.userId,req.params.friendId);
            return res.status(200).send(request);
        }catch(error){
            next(error);
        }
    }

    //Handel Request
    async acceptReject(req,res,next){
        try{
            let {action} = req.query;
            let requestHandeler = await this.friendRepo.handelRequest(req.userId,req.params.friendId,action);
            return res.status(404).send(requestHandeler);
        }catch(error){
            next(error);
        }

    }

    //Get user frined 
    async getUserFriends(req,res,next){
        try{
            let friends = await this.friendRepo.getFriends(req.params.userId);
            return res.status(200).send(friends);
        }catch(error){
            next(error);
        }
    }


    //getting feriend requests
    async getFriendRequest(req,res,next){
        try{
            let recivedRequest = await this.friendRepo.recivedRequest(req.userId);
            return res.status(200).send(recivedRequest);
        }catch(error){
            next(error);
        }
    }

    //getting Sent Request
    async getSentRequest(req,res,next){
        try{
            let sentRequest = await this.friendRepo.sentRequest(req.userId);
            return res.status(200).send(sentRequest);
        }catch(error){
            next(error);
        }
    }
}