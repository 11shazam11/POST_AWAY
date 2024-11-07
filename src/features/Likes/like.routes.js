import express from "express";
import { LikeController } from "./like.controller.js";

//Like Router

const likeRoutes = express.Router();

//Controller Instance
const likeController = new LikeController();

//Add like
likeRoutes.post("/:postId",(req,res,next)=>{
    likeController.likeAdd(req,res,next);
});

export default likeRoutes;