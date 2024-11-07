import express from "express";
import { FriendController } from "./friend.controller.js";

const friendRoutes = express.Router();

const friendController = new FriendController();

//send request
friendRoutes.post("/toggel-friendship/:friendId",(req,res,next)=>{
    friendController.sendRequest(req,res,next);
});

//accept or reject request
friendRoutes.post("/response-to-request/:friendId",(req,res,next)=>{
    friendController.acceptReject(req,res,next);
})
//get User Friends
friendRoutes.get("/get-friends/:userId",(req,res,next)=>{
    friendController.getUserFriends(req,res,next);
})
//get Recived Request
friendRoutes.get("/get-pending-request",(req,res,next)=>{
    friendController.getFriendRequest(req,res,next);
})

//get sent Request
friendRoutes.get("/sent",(req,res,next)=>{
    friendController.getSentRequest(req,res,next);
});




export default friendRoutes;