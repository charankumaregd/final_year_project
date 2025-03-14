import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

type sendEmailParams = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

function getFromEmail() {
  return process.env.NODE_ENV === "development"
    ? "onboarding@resend.dev"
    : (process.env.EMAIL_SENDER as string);
}

function getToEmail(to: string) {
  return process.env.NODE_ENV === "development" ? "delivered@resend.dev" : to;
}

export async function sendMail({ to, subject, text, html }: sendEmailParams) {
  return await resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    text,
    html,
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
