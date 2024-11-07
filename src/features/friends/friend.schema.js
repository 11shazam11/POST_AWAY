import mongoose from "mongoose";

//friend feature Schema
export const friendSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sent:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            status:{
                type:Boolean,
                default:false
            }
        }
    ],
    recived:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            status:{
                type:Boolean,
                default:false
            }
        }
    ],
    friends:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        }
    ]
});


