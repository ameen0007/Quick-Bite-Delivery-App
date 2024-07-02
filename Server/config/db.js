const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connected");
    } catch (error) {
        console.log("error connecting",error.message);
    }
}

module.exports = connectDB;
