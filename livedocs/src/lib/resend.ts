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
