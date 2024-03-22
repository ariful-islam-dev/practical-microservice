import { EMAIL_SERVICE } from "@/config";
import prisma from "@/prisma";
import { AccessTokenDTOSchema, EmailVerificationSchema } from "@/schemas";
import axios from "axios";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the request body
    const parseBody = EmailVerificationSchema.safeParse(req.body);
    if (!parseBody.success) {
      return res.status(400).json({ error: parseBody.error.errors });
    }

    // Check if the user with email exists

    const user = await prisma.user.findUnique({
      where: { email: parseBody.data.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code: parseBody.data.code,
      },
    });

    if (!verificationCode) {
      return res.status(404).json({ message: "Invalid verification code" });
    }

    // if the code has expired
    if (verificationCode.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // update user status to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        status: "ACTIVE",
      },
    });

    // update verification code status to
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { status: "USED", verifiedAt: new Date() },
    });

    // Send Success email
    await axios.post(`${EMAIL_SERVICE}/emails/send`, {
      recipient: user.email,
      subject: "Email Verified",
      body: "Your email has been verified successfully",
      source: "verify-email",
    });

    return res.status(200).json({ message: "Email Verified Successfully" });
  } catch (error) {
    next(error);
  }
};

export default verifyEmail;
