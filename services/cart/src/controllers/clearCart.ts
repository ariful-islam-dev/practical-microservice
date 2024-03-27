import redis from "@/redis";
import { NextFunction, Request, Response } from "express";

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartSessionId = (req.headers["x-cart-session-id"] as string) || null;

    if (!cartSessionId) {
      return res.status(200).json({ message: "Cart is empty" });
    }

    // check if the session id exists in the store
    const exists = await redis.exists(`sessions:${cartSessionId}`);
    if (!exists) {
      delete req.headers["x-cart-session-id"];
      return res.status(200).json({ message: "Cart is empty" });
    }
    // clear the cart
    await redis.del(`sessions:${cartSessionId}`);
    await redis.del(`cart:${cartSessionId}`);

    delete req.headers["x-cart-session-id"];

    return res.status(200).json({ message: "Cart is clear" });
  } catch (error) {
    next(error);
  }
};

export default clearCart;
