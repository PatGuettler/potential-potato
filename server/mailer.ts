import nodemailer from "nodemailer";
import { log } from "./vite";

/** Returns an email sender when SMTP_URL is configured (e.g. smtps://user:pass@smtp.example.com:465). */
export function createMailer() {
  const url = process.env.SMTP_URL;
  if (!url) {
    log("SMTP_URL not set: password reset emails are off; admins can still create reset links.");
    return undefined;
  }
  const transport = nodemailer.createTransport(url);
  const from = process.env.MAIL_FROM || "STEM Academy <no-reply@localhost>";
  return async ({ to, name, link }: { to: string; name: string; link: string }) => {
    await transport.sendMail({
      from,
      to,
      subject: "Reset your STEM Academy password",
      text: `Hi ${name},\n\nUse this link to choose a new password. It expires in one hour.\n\n${link}\n\nIf you didn't ask for this, you can ignore this email.`,
    });
  };
}
