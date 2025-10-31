import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.MONGODBCONNECTIONSTRING;

const DBConnection = async () =>{
    console.log("connection string", connectionString);
    const connection = await mongoose.connect(connectionString)
    console.log("DB is connected")
    return connection
}
export default DBConnection;

