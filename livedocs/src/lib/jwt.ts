import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
}
