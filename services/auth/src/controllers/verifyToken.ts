import prisma from "@/prisma";
import { AccessTokenDTOSchema } from "@/schemas";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parseBody = AccessTokenDTOSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    const { accessToken } = parseBody.data;

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRETE as string);
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.status(200).json({ message: "Authorized", user });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
