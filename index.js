import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose';
import DBConnection from './Database/DBConfig.js';
import itemrouter from './Router/Item.Router.js'
const app = express()
dotenv.config()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express.json() → for JSON requests (Postman raw JSON, frontend fetch with application/json).If you don’t use this, req.body will be undefined when you send JSON data from Postman or frontend.
// express.urlencoded() → for form submissions (application/x-www-form-urlencoded).

app.use(cors())
const port = process.env.PORT
DBConnection()

app.get("/",(req,res)=>{
    res.status(200).json("Api is working")
})
// http://localhost:4000/ gives Api is working
app.use('/api/item',itemrouter)
app.listen(port,()=>{
    console.log(`App is running on the port ${port}`)
})
