import multer from "multer";

//File upload oonfig using multer
const fileUploadConfig = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,"./public/uploads");
    },
    filename:function (req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g,'_') + file.originalname);
    }
});



export const fileUpload = multer({storage:fileUploadConfig});