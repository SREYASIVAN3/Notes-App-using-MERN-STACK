require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.DB) {
            throw new Error("MongoDB URI is missing in .env file");
        }
        
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(" MongoDB Connected Successfully");
    } catch (error) {
        console.error(" MongoDB Connection Error:", error.message);
        process.exit(1); 
    }
};

module.exports = connectDB;
