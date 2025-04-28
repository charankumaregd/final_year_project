import { AccessRole } from "@prisma/client";
import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters");

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .transform((val) => val.toLowerCase());

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must include at least one uppercase letter")
  .regex(/[a-z]/, "Must include at least one lowercase letter")
  .regex(/[0-9]/, "Must include at least one number")
  .regex(/[\W_]/, "Must include at least one special character");

export const verificationCodeSchema = z
  .string()
  .trim()
  .length(6, "Verification code must be 6 digits")
  .regex(/^\d{6}$/, "Verification code must be numeric");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema.extend({
  name: nameSchema,
});

export const verifyEmailSchema = z.object({
  email: emailSchema,
  verificationCode: verificationCodeSchema,
});

export const getEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = getEmailSchema.extend({
  newPassword: passwordSchema,
});

export const createDocumentSchema = z.object({
  title: z.string().optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const createDocumentAccessSchema = z.object({
  email: emailSchema,
  documentId: z.string().uuid("Invalid document ID"),
});

export const updateDocumentAccessSchema = createDocumentAccessSchema.extend({
  role: z.enum(Object.values(AccessRole) as [AccessRole]),
});

export const deleteDocumentAccessSchema = createDocumentAccessSchema;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export type GetEmailFormValues = z.infer<typeof getEmailSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export type createDocumentAccessValues = z.infer<
  typeof createDocumentAccessSchema
>;

export type UpdateDocumentAccessValues = z.infer<
  typeof updateDocumentAccessSchema
>;

export type DeleteDocumentAccessValues = z.infer<
  typeof deleteDocumentAccessSchema
>;
