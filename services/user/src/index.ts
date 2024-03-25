import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createUser, getUserById } from './controllers';

dotenv.config();


const app = express();
app.use([express.json(), cors(), morgan('dev')])

app.get("/health", (_req, res)=>{
    res.status(200).json({status: "UP"})
})

// app.use((req, res, next)=>{
//     const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081'];
//     const origin = req.headers.origin || "";

//     if(allowedOrigins.includes(origin)){
//         res.setHeader("Access-Control-Allow-Origin", origin);
//         next();
//     }else{
//         res.status(403).json({message: 'Forbidden'})
//     }
// })

// Routes
app.get("/users/:id", getUserById);
app.post("/users", createUser)

// 404 handler
app.use((_req, res)=>{
    res.status(404).json({message: 'Not found'})
})


// Error Handler

app.use((err, _req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error'})
})

const port = process.env.PORT || 4004;
const serviceName = process.env.SERVICE_NAME || "User_Service";

app.listen(port, ()=>{
    console.log(`${serviceName} is running on port ${port}`)
})