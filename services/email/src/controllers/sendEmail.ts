import { defaultSender } from "../config";
import { transporter } from "@/config";
import prisma from "@/prisma";
import { EmailCreateSchema } from "@/schemas";
import { NextFunction, Request, Response } from "express";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // validate the request body
    const parsedBody = EmailCreateSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({ error: parsedBody.error.errors });
    }

    // create mail option
    const { sender, recipient, subject, body, source } = parsedBody.data;
    const form = sender || defaultSender;

    const emailOption = {
      form,
      to: recipient,
      subject,
      text: body,
    };

    // Send the email

    const { rejected } = await transporter.sendMail(emailOption);
    console.log("parse Body:", parsedBody);
    if (rejected.length) {
      console.log(rejected);
      return res.status(500).json({ message: "Failed" });
    }

    await prisma.email.create({
      data: {
        sender: form,
        recipient,
        subject,
        body,
        source,
      },
    });

    return res.status(200).json({ message: "Email Send" });
  } catch (error) {
    next(error);
  }
};

export default sendEmail;
