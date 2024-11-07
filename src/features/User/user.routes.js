import express from "express";
import { UserController } from "./user.controller.js";
import jwtAuth from "../../middlewares/jwtauthentication.js";

//creating router
const userRouter = express.Router();
//constroller Instance
let userController = new UserController();

//register route
userRouter.post("/signup",(req,res,next)=>{
    userController.signUp(req,res,next);
});

//login 
userRouter.post("/signin",(req,res,next)=>{
    userController.signIn(req,res,next);
});

//Logout
userRouter.post("/logout",jwtAuth,(req,res,next)=>{
    userController.logoutUser(req,res,next);
})

//LogoutAll
userRouter.post("/logout-all-devices",jwtAuth,(req,res,next)=>{
    userController.logAll(req,res,next);
})

//User Info 

//get One
userRouter.get("/get-details/:userId",(req,res,next)=>{
    userController.getOneUser(req,res,next)
})

//get All users
userRouter.get("/get-all-details",(req,res,next)=>{
    userController.getAllUsers(req,res,next);
});

//update User 
userRouter.put("/update-details/:userId",(req,res,next)=>{
    userController.updateUserCon(req,res,next);
})
//Reset Password 

//Send OTP
userRouter.post("/resetPassword/otp",(req,res,next)=>{
    userController.otpMail(req,res,next);
});

//verifyOtp

userRouter.post("/resetPassword/verify",(req,res,next)=>{
    userController.verifyOtp(req,res,next);
});

//Set New Password

userRouter.post("/resetPassword/setPassword",(req,res,next)=>{
    userController.setNewPassword(req,res,next);
})

export default userRouter;