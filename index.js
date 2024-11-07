//Dotenv for variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
//For api documenataion 
import swagger from "swagger-ui-express";
//api docs json file (swagger)
import apiDocs from "./swagger.json" assert {type:"json"};

//body-parser for parsing json data
import bodyParser from "body-parser";
//importing moongoose Congig
import {connectByMongoose} from "./src/config/mongoose.congif.js";
//Sessions
import session from "express-session";
//user Router
import userRouter from "./src/features/User/user.routes.js";
//post Router
import postRoutes from "./src/features/Post/post.routes.js";
//Commetn route
import commetnRoute from "./src/features/Comments/comment.routes.js";
//Like route
import likeRoutes from "./src/features/Likes/like.routes.js";
//Friend Routes
import friendRoutes from "./src/features/friends/friend.routes.js";
//jwt Auth
import jwtAut from "./src/middlewares/jwtauthentication.js";
//Application Error
import { ApplicationError } from "./src/features/error-handeler/application_error.js";
//Logger middlewares
import { loggerMiddleware,errorLogger } from "./src/middlewares/errorlogger.js";

const app = express();              //creating Server




app.use(bodyParser.json());         //using bodyPrser

app.use(express.static("public"));    //making the folder public

app.use(session({               //Session Configuration
    secret:"MySecretKey",
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:6000*60,
    }
}));

//api-documentation using swagger
app.use("/api-docs",swagger.serve,swagger.setup(apiDocs));

app.use(loggerMiddleware);          //Loggs the user requst and data

app.use("/api/user/",userRouter);     //User Router setup 

app.use("/api/post/",jwtAut,postRoutes);       //Post routes

app.use("/api/comment/",jwtAut,commetnRoute);       //Comment Route

app.use("/api/like/",jwtAut,likeRoutes);        //Like Routes

app.use("/api/friend/",jwtAut,friendRoutes);        //Friend Routes

//Handel Applicaion level Error
app.use((error,req,res,next)=>{
    errorLogger(error,req);             //Logs the Error
    if(error instanceof ApplicationError){
        return res.status(error.code).send(error.message);
    };
    console.log(error);
    return res.status(500).send("Something Went wrong.Please try again Later")
});

//setting up the port 
app.listen(3000,()=>{
    console.log("server is listning at prt 3000");
    connectByMongoose();
});