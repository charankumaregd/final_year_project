import { JWTPayload, SignJWT, jwtVerify } from "jose";

import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "@/lib/env";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(JWT_REFRESH_TOKEN_SECRET);

type JwtPayload = JWTPayload & {
  userId: string;
  sessionId: string;
};

export async function generateAccessToken(userId: string, sessionId: string) {
  return new SignJWT({ userId, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(ACCESS_TOKEN_SECRET);
}

export async function generateRefreshToken(userId: string, sessionId: string) {
  return new SignJWT({ userId, sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(REFRESH_TOKEN_SECRET);
}

export async function verifyAccessToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_TOKEN_SECRET);
    return payload as JwtPayload;
  } catch (error) {
    console.log(`Error in verifying: ${error}`);
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
