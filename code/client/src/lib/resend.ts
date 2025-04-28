import { Resend } from "resend";

import { NODE_ENV, RESEND_API_KEY, RESEND_EMAIL_SENDER } from "@/lib/env";

export const resend = new Resend(RESEND_API_KEY);

type sendEmailParams = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function getFromEmail() {
  return NODE_ENV === "development"
    ? "onboarding@resend.dev"
    : RESEND_EMAIL_SENDER;
}

function getToEmail(to: string) {
  return NODE_ENV === "development" ? "delivered@resend.dev" : to;
}

export async function sendMail({ to, subject, html, text }: sendEmailParams) {
  return await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    html,
    text,
  });
}

export async function sendVerificationCodeMail(email: string, code: string) {
  try {
    await resend.emails.send({
      from: getFromEmail(),
      to: getToEmail(email),
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
