import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Others"]
    },
    tokens:[
        {
            type:String
        }
    ],
    discard:[
        {
        type:String
        }
    ]
})