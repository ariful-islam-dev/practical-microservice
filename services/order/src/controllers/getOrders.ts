import prisma from "@/prisma";
import { NextFunction, Request, Response } from "express";

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
      },
    });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export default getOrders;
