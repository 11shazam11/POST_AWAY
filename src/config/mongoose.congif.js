import mongoose from "mongoose";

// Connecting to MongoDB via Mongoose
export const connectByMongoose = async () => {
    try {
        await mongoose.connect("mongodb+srv://dhumneabhay:N8cbIEByijv2R7SP@cluster0.4juvi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/postaway");
        console.log("Connected to MongoDB via Mongoose");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
