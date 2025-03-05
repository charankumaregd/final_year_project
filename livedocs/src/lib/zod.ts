import { z } from "zod";

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters");

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[\W_]/, "Must include at least one special character");

export const verificationCodeSchema = z
  .string()
  .length(6, "OTP must be 6 digits");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: nameSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: emailSchema,
  verificationCode: verificationCodeSchema,
});

export const resetPasswordSchema = verifyEmailSchema.extend({
  newPassword: passwordSchema,
});
