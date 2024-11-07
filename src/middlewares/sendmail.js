import nodemailer from "nodemailer";

export const otpMail = async (mailOptions) => {
    try{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.SeanderMail,
            pass:process.env.SenderPassKey
        }
    });

    const send = await transporter.sendMail(mailOptions);
    return send;
}catch(error){
    throw error;
}


}