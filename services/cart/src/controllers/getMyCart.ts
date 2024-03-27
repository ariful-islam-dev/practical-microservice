import redis from "@/redis";
import { NextFunction, Response, Request } from "express";

const getMyCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartSessionId = (req.headers["x-cart-session-id"] as string) || null;
    if (!cartSessionId) {
      return res.status(200).json({ data: [] });
    }
    // check if the session id exists in to store
    const session = await redis.exists(`sessions:${cartSessionId}`);
    if (!session) {
      await redis.del(`cart:${cartSessionId}`);
      return res.status(200).json({ data: [] });
    }

    const items = await redis.hgetall(`cart:${cartSessionId}`);
    if (Object.keys(items).length === 0) {
      return res.status(200).json({ data: [] });
    }
    // formate the items
    const formattedItems = Object.keys(items).map((key) => {
      const { quantity, inventoryId } = JSON.parse(items[key]) as {
        inventoryId: string;
        quantity: number;
      };
      return {
        inventoryId,
        quantity,
        productId: key,
      };
    });

    return res.status(200).json({ data: formattedItems });
  } catch (error) {
    next(error);
  }
};

export default getMyCart;
