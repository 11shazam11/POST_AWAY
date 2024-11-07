import mongoose from "mongoose";

// Password Reset Schema
export const resetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    otp: {
        type: Number,
        required: true
    },
    expires: {
        type: Date,
        required: true,
        index: { expires: '5m' } // Automatically delete after 1 minute (adjust as needed)
    },
    sessionId:{
        type:String,
        required:true
    }
});
