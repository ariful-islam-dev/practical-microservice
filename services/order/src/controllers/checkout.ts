// Validate user inputs
// get cart Items using cartSessionId
// If cart is empty return 400 error
// Find all product details by the product id from carts
// crate order and order items
// invoke email service

import { CartItemDTOSchema, OrderCreateDTOSchema } from "@/schemas";
import { NextFunction, Response, Request } from "express";
import axios from "axios";
import { CART_SERVICE, EMAIL_SERVICE, PRODUCT_SERVICE } from "@/config";
import { z } from "zod";
import prisma from "@/prisma";

// invoke cart service
const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate request
    const parseBody = OrderCreateDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // get cart details
    const { data: cartData } = await axios.get(`${CART_SERVICE}/cart/me`, {
      headers: {
        "x-cart-session-id": parseBody.data.cartSessionId,
      },
    });

    const cartItems = z.array(CartItemDTOSchema).safeParse(cartData.data);

    if (!cartItems.success) {
      return res.status(400).json({ errors: cartItems.error.errors });
    }

    if (cartItems.data.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // get product details from cart items
    const productDetails = await Promise.all(
      cartItems.data.map(async (item) => {
        const { data: product } = await axios.get(
          `${PRODUCT_SERVICE}/products/${item.productId}`
        );
        return {
          productId: product.id as string,
          productName: product.name as string,
          sku: product.sku as string,
          price: product.price as number,
          quantity: item.quantity,
          total: product.price * item.quantity,
        };
      })
    );

    const subtotal = productDetails.reduce((acc, item) => {
      return acc + item.total;
    }, 0);

    // TODO: will handle tax calculation later
    const tax = 0;
    const grandTotal = subtotal + tax;

    // create order
    const order = await prisma.order.create({
      data: {
        userId: parseBody.data.userId,
        userName: parseBody.data.userName,
        userEmail: parseBody.data.userEmail,
        subtotal: subtotal,
        tax: tax,
        grandTotal: grandTotal,
        orderItems: {
          create: productDetails.map((item) => ({
            ...item,
          })),
        },
      },
    });

    // clear cart service
    await axios.get(`${CART_SERVICE}/cart/clear`, {
      headers: {
        "x-cart-session-id": parseBody.data.cartSessionId,
      },
    });

    // send email
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient: parseBody.data.userEmail,
      subject: "Order Confirmation",
      body: `Thank you for your order. Your order has been successfully placed. Order id is: ${order.id}. Your order total Price is ${grandTotal}.`,
      source: "Checkout",
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
export default checkout;
