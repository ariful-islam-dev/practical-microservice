import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { addToCart, clearCart, getMyCart } from "./controllers";
import "./events/onKeyExpires";

dotenv.config();

const app = express();

// request logger
app.use([morgan("dev"), express.json()]);

// TODO: Auth Middleware

// routes
app.post("/cart/add-to-cart", addToCart);
app.get("/cart/me", getMyCart);
app.get("/cart/clear", clearCart);

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

const port = process.env.PORT || 4006;
const serviceName = process.env.SERVICE_NAME || "Cart_Service";

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
