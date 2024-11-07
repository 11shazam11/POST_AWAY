import nodemailer from "nodemailer";

export const otpMail = async (mailOptions) => {
    try{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"dhumneabhay@gmail.com",
            pass:"teki tvrd sgbk bwdj"
        }
    });

    const send = await transporter.sendMail(mailOptions);
    return send;
}catch(error){
    throw error;
}


}
