// import { transporter } from '@/config';
import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host:'smtp.'
// });
// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp.mailtrap.io",
//   port: parseInt(process.env.SMTP_PORT || "587"),
//   secure: true,
//   auth: {
//     user: process.env.DEFAULT_SENDER_EMAIL,
//     pass: process.env.SENDER_PASS, // naturally, replace both with your real credentials or an application-specific password
//   },
// });
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "1025"),
});

export const defaultSender =
  process.env.DEFAULT_SENDER_EMAIL || "admin@example.com";
