import prisma from "@/prisma";
import { UserCreateDTOSchema, UserLoginDTOschema } from "@/schemas";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { LoginAttempt } from "@prisma/client";

type loginHistory = {
  userId: string;
  userAgent: string | undefined;
  ipAddress: string | undefined;
  attempt: LoginAttempt;
};

const createLoginHistory = async (info: loginHistory) => {
  await prisma.loginHistory.create({
    data: {
      userId: info.userId,
      userAgent: info.userAgent,
      ipAddress: info.ipAddress,
      attempt: info.attempt,
    },
  });
};

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress =
      (req.headers["x-forwarded-for"] as string) || req.ip || "";
    const userAgent = req.headers["user-agent"] || "";

    // Validate the request Body
    const parsedBody = UserLoginDTOschema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.errors });
    }

    //check if the user already exists
    const user = await prisma.user.findUnique({
      where: {
        email: parsedBody.data.email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      parsedBody.data.password,
      user.password
    );
    if (!isMatch) {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if the  user is verified
    if (!user.verified) {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({ message: "User not verified" });
    }

    // check if the account is active
    if (user.status !== "ACTIVE") {
      await createLoginHistory({
        userId: user.id,
        userAgent,
        ipAddress,
        attempt: "FAILED",
      });
      return res.status(400).json({
        message: `Your account is ${user.status.toLocaleLowerCase()}`,
      });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRETE ?? "my_secrete_key",
      { expiresIn: "2h" }
    );
    await createLoginHistory({
      userId: user.id,
      userAgent,
      ipAddress,
      attempt: "SUCCESS",
    });

    return res.json(accessToken).status(200);
  } catch (error) {
    next(error);
  }
};

export default userLogin;
