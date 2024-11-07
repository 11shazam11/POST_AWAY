import mongoose from "mongoose";

// Connecting to MongoDB via Mongoose
export const connectByMongoose = async () => {
    try {
        await mongoose.connect(process.env.DB_Url)
        console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
