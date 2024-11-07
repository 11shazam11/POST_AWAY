import jwt from "jsonwebtoken";
import { userModel } from "../features/User/user.repository.js";

//creating a JWT verify/authentication function

const jwtAuth = async (req,res,next)=>{
    try{
        //1.get the token 
        const token = req.headers["authorization"];
        //2.if not found
        if(!token){
            throw new Error("token not found");
        }

        //check if the token is discarde
        let tokenStatus = await blaacklist(token,req.session.mail);
        if(tokenStatus){
            return res.status(404).send({success:false,msg:"Token expired"});
        }
        //3.If present Validate and see

        const payload = jwt.verify(token,"dp8LkdD5qCMQ6KswQbchL5hagMo0jsJP");
        //Extract the payload
        req.userId = payload.userId;
        next();
    }catch(error){
        next(error);
    }
}

//check if token is blacklisted
async function blaacklist(token,email){
    try{
        console.log(email);
        let user = await userModel.findOne({email:email});
        console.log(user);
        return await user.discard.includes(token);
    }catch(error){
        throw error;
    }
}
export default jwtAuth;
