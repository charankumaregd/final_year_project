function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const NODE_ENV = getEnv("NODE_ENV");

export const RESEND_EMAIL_SENDER = getEnv("RESEND_EMAIL_SENDER");

export const RESEND_API_KEY = getEnv("RESEND_API_KEY");

export const JWT_ACCESS_TOKEN_SECRET = getEnv("JWT_ACCESS_TOKEN_SECRET");

export const JWT_REFRESH_TOKEN_SECRET = getEnv("JWT_REFRESH_TOKEN_SECRET");
