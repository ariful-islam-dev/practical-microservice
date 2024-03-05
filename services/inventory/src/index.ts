import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config();


const app = express();
app.use([express.json(), cors(), morgan('dev')])

app.get("/health", (_req, res)=>{
    res.status(200).json({status: "UP"})
})

// 404 handler
app.use((_req, res)=>{
    res.status(404).json({message: 'Not found'})
})
// Error Handler

app.use((err, _req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error'})
})

const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || "inventory-service";

app.listen(port, ()=>{
    console.log(`${serviceName} is running on port ${port}`)
})