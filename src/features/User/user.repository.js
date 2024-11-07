import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import session from "express-session";
import { otpMail } from "../../middlewares/sendmail.js";
import { resetSchema } from "./password.reset.schema.js";
import { ApplicationError } from "../error-handeler/application_error.js";

//password reset Schema 
const resetModel = new mongoose.model("OTP",resetSchema);
//creating userModel 
export const userModel = new mongoose.model("User",userSchema);

//user Repository
export class UserRepo{
    //register function
    async register(user){
        try{
            let hashedPassword = await bcrypt.hash(user.password,12);
            let newUser = new userModel({
                name:user.name,
                email:user.email,
                password:hashedPassword,
                age:user.age,
                gender:user.gender
            });
            if(!newUser){
                throw new ApplicationError("Enter Valid Details",400);
            }
            await newUser.save();
            return {success:true,msg:"Registered Successfully",User:newUser};
        }catch(error){
            throw error;
        }
    }

    //login function
    async login(email, password) {
        try {
            const user = await userModel.findOne({ email: email });
            
            if (!user) {
                throw new ApplicationError("User not found",404);
                // return { success: false, message: "User Not Found" };
            }

            //Verify the password
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {

                //create jwt token
                const token = jwt.sign({userId:user._id},"dp8LkdD5qCMQ6KswQbchL5hagMo0jsJP",{expiresIn:"1h"});
                await user.tokens.push(token);
                await user.save();
                return { success: true, message: "Login successful", user: token };
            } else {
                throw new ApplicationError("Invalid Credentials",404);
                // return { success: false, message: "Invalid Credentials" };
            }
        } catch (error) {
            throw error;
        }
    }

    //logout
    async logout(token,userId){
        try{
        
            let user = await userModel.findById(userId);
            //discard the token
            await user.discard.push(token);
            await user.save();
            return {success:true,msg:"Logout Successfully"};
        }catch(error){
            throw error;
        }
    }

    //Log out from all Devices
    async logoutFromAll(userId){
        try{
            let user = await userModel.findById(userId);
            if(!user){
                throw new ApplicationError("User not found",404);
            }

            //Discard all tokens 
            for(let token of user.tokens){
                user.discard.push(token);
            }
            await user.save();
            return {success:true,msg:"Logged Out from all devices"};
        }catch(error){
            throw error;
        }
    }

    //Get User Informations
    //Get One

    async getUserInfo(userId){
        try{
            let user = await userModel.findOne({userId:mongoose.Types.ObjectId(userId)},{password:0,_id:0,tokens:0,discard:0});
            if(!user){
                throw new ApplicationError("Unable to lacate User Info",404);
            }
            return {success:true,resp:user};
        }catch(error){
            throw error;
        }
    }


    //Get All

    async getAll(){
        try{
            let allUsers = await userModel.find({},{password:0,_id:0,tokens:0,discard:0});
            return {success:true,resp:allUsers};
        }catch(error){
            throw error;
        }
    }

    //upade user
    async updateUser(userId, updateData) {
        try {
            // Find the user by ID
            const user = await userModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found", 404);
            }
            
    
            // Update only the fields that are provided in updateData
            Object.keys(updateData).forEach((key) => {
                if (updateData[key] !== undefined) {
                    user[key] = updateData[key];
                }
            });
    
            // If the password is being updated, hash it before saving
            if (updateData.password) {
                user.password = await bcrypt.hash(updateData.password, 12);
            }
    
            await user.save();
            return { success: true, msg: "User updated successfully", resp:user };
        } catch (error) {
            throw error;
        }
    }
    

    //Password Reset

    //1.Create and send OTP via mail
    async sendOtp(email,id){
        try{
            let user = await userModel.findOne({email:email});
            if(!user){
                throw new ApplicationError("User Not found",404)
            }

            //generate OTP 
            const otp = Math.floor( 100000+ Math.random()*900000);
            //new Password reset model
            let mail = new resetModel({
                email:email,
                otp:otp,
                expires:new Date(),
                sessionId:id
            });
            //Mail optinos for sending mail
            let mailOptions = {
                from:"dhumneabhay@gmail.com",
                to:email,
                subject:"OTP for password Reset",
                text:`your OTP for resetting Password is ${otp}`
            }
            //Send Mail
            let sendOtpmail = await otpMail(mailOptions);
            await mail.save();
            return {success:true,msg:"OTP Sent",resp:sendOtpmail};
        }catch(error){
            
            throw error;
        }
    }

    //2.Verify OTP

    async otpVerification(userotp,userEmail){
        try{

            let found = await resetModel.findOne({email:userEmail,otp:userotp});
            //verify OTP
            if(!found){
                throw new ApplicationError("Invalid OTP",404);
            }
            return {success:true,msg:"OTP verified Please set a new Password"};
        }catch(error){
            throw error;
        }
    }

    //3.Set new Password
    async createNewPassword(verified,newPassword,useremail){
        try{
            if(!verified){
                throw new ApplicationError("Verify OTP frist",400);
            }
            
            let user = await userModel.findOne({email:useremail});
            //save hashed password
            let hashedPassword = await bcrypt.hash(newPassword,12);
            user.password = hashedPassword;
            await user.save();
            return {success:true,msg:"Password Reset Successfull",resp:user};
        }catch(error){
            throw error;
        }
    }
    
}
