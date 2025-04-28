import { AccessRole } from "@prisma/client";

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  color: string;
  createdAt: string;
};

export type ActiveUser = {
  id: string;
  name: string;
  email: string;
  color: string;
};

export type SharedUsers = {
  id: string;
  role: AccessRole;
  user: User;
};

export type Document = {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  userAgent: string;
  isCurrent: boolean;
  createdAt: string;
};
