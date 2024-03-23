import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { configureRoute } from "./utils";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 request per windowsMs
  handler: (_req, res) => {
    res
      .status(429)
      .json({ message: "too many requests, please try again later" });
  },
});

app.use("/api", limiter);

// request logger
app.use([morgan("dev"), express.json()]);

// TODO: Auth Middleware

// routes
configureRoute(app);
// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "UP" });
});

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not Found" });
});
// error handler
app.use((err, _req, res, _next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`API Gateway is running on port ${port}`);
});
