//Logger Library
import winston from "winston";

//logger Configuration 

const loggerConfig = winston.createLogger({
    level:"info",
    format: winston.format.json(),
    transports:[
        new winston.transports.File({filename:"log.txt"}),                          //logging requests
        new winston.transports.File({filename:"error.txt",level:"error"})           //logging Errors
    ]
});

//for logging requests

const loggerMiddleware = (req,res,next)=> {
    //1.Check if request is is not Signup or Sign In 
    //Bcz then The user info may also be logged in the file  Privacy voilate
    //include all the paths whre user needs to input valuable data
    if(req.url.includes("login") || req.url.includes("signUp")){
        next();
    }else{
        //seet up the data to be logged
        let data = {
            TimeStamp:new Date().toString(),
            URL: req.url,
            Body: JSON.stringify(req.body)
        }

         //Log the data
    loggerConfig.info(data);
    next();
    };
}

//for logging Errors
const errorLogger = (er,req)=>{
    let data= {
        TimeStamp: new Date().toString(),
        URL:req.url,
        Body:JSON.stringify(req.body),
        ErrorMsg:er.message,
        Stack:er.stack
    }

    //log the error data
    loggerConfig.error(data);

}

export {loggerMiddleware,errorLogger};
