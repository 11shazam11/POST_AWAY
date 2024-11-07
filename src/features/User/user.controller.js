import mongoose from "mongoose";
//user Repository
import { UserRepo } from "./user.repository.js";
import { ApplicationError } from "../error-handeler/application_error.js";


//creating User Controller
export class UserController{
    constructor(){
        //creating repo instance
        this.userRepo = new UserRepo;
    }

    //User Register
    async signUp(req,res,next){
        try{
            let newUser = await this.userRepo.register(req.body);
            console.log(newUser);
            if(newUser.success){
                return res.status(200).send(newUser);
            }
        }catch(error){
            next(error);
        }
    }

    //login user
    async signIn(req,res,next){
        try{
            //extract params 
            let {email,password} = req.body;
            
            let logger = await this.userRepo.login(email,password);
            if(!logger.success){
                return res.status(400).send(logger);
            }else{
                req.session.mail = email;
                return res.status(200).send(logger);
            }
        }catch(error){
            next(error);
        }
    }

    //Logout

    async logoutUser(req,res,next){
        try{
            //extract token
            let token = req.headers["authorization"];
            let loogedOut = await this.userRepo.logout(token,req.userId);
            return res.status(200).send(loogedOut);
        }catch(error){
            next(error);
        }
    }

    //LogOut from All Devices
    async logAll(req,res,next){
        try{
            //Extract userid from token
            let logOut = await this.userRepo.logoutFromAll(req.userId);
            return res.status(200).send(logOut);
        }catch(error){
            next(error);
        }
    }

    //Get User Info 

    //One user info
    async getOneUser(req,res,next){
        try{
            let userId = req.params.userId;
            let user = await this.userRepo.getUserInfo(userId);
            return res.status(200).send(user);
        }catch(error){
            next(error);
        }
    }

    //All user Info
    async getAllUsers(req,res,next){
        try{
            let users = await this.userRepo.getAll();
            return res.status(200).send(users);
        }catch(error){
            next(error);
        }
    }

    //Update User
    async updateUserCon(req,res,next){
        try{
            let updatedUser = await this.userRepo.updateUser(req.params.userId,req.body);
            return res.status(200).send(updatedUser);
        }catch(error){
            next(error)
        }
    }
    //Reset password

    //1.Send Otp
    async otpMail(req,res,next){
        try{
            let {email} = req.body;
            req.session.email = email;
            let sendOtp = await this.userRepo.sendOtp(email,req.session.id);
            return res.status(200).send(sendOtp);
        }catch(error){
            next(error);
        }
    }

    //2.Verify Otp
    async verifyOtp(req,res,next){
        try{

            let {otp} = req.body;
            let email = req.session.email;

            let verify = await this.userRepo.otpVerification(otp,email);
            if(!verify.success){
                //if otp verified set
                req.session.verified = false;
            }
            req.session.verified = true;
            return res.status(200).send(verify);
        }catch(error){
            next(error);
        }
    }

    //3.Set New Password
    async setNewPassword(req,res){
        try{
            //Extract info 

            let verified = req.session.verified;
            let email = req.session.email;
            let {newPassword} = req.body;

            let reset = await this.userRepo.createNewPassword(verified,newPassword,email);
            return res.status(200).send(reset);
        }catch(error){
            next(error);
        }
    }
}