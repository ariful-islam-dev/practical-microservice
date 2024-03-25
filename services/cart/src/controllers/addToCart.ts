import { CART_TTL, INVENTORY_SERVICE_URL } from "@/config";
import redis from "@/redis";
import { CartItemDTOSchema } from "@/schmas";
import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";
const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parseBody = CartItemDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ errors: parseBody.error.errors });
    }

    let cartSessionId = (req.headers["x-cart-session-id"] as string) || null;
    // check if cart session is is present in the request header and exists in the store
    if (cartSessionId) {
      const exists = await redis.exists(`sessions:${cartSessionId}`);
      console.log("Session Exists", exists);

      if (!exists) {
        cartSessionId = null;
      }
    }

    // if cart session id is not present, create a new one
    if (!cartSessionId) {
      cartSessionId = uuid();
      console.log("New Session Id", cartSessionId);

      // set cart session id in the redis store
      await redis.setex(`sessions:${cartSessionId}`, CART_TTL, cartSessionId);

      // set cart session id in the response  header
      res.setHeader("x-cart-session-id", cartSessionId);
    }

    // check if the inventory is available
    const { data } = await axios.get(
      `${INVENTORY_SERVICE_URL}/inventory/${parseBody.data.inventoryId}`
    );
    if (Number(data.quantity) < parseBody.data.quantity) {
      return res.status(400).json({ message: "Inventory not available" });
    }

    // add item to cart
    await redis.hset(
      `cart:${cartSessionId}`,
      parseBody.data.productId,
      JSON.stringify({
        inventoryId: parseBody.data.inventoryId,
        quantity: parseBody.data.quantity,
      })
    );

    return res
      .status(200)
      .json({ message: "Item added to cart", cartSessionId });

    //TODO: update the inventory
  } catch (error) {
    next(error);
  }
};
export default addToCart;
