import { NextResponse } from "next/server";

const REFRESH_PATH = "/api/refresh";
const secure = process.env.NODE_ENV === "production";

const defaultCookieOptions = {
  sameSite: "strict" as const,
  httpOnly: true,
  secure,
};

export function getAccessTokenCookieOptions() {
  return {
    ...defaultCookieOptions,
    path: "/",
    maxAge: 15 * 60,
  };
}

export function getRefreshTokenCookieOptions() {
  return {
    ...defaultCookieOptions,
    path: REFRESH_PATH,
    maxAge: 30 * 24 * 60 * 60,
  };
}

export function setAccessToken(response: NextResponse, accessToken: string) {
  response.cookies.set(
    "accessToken",
    accessToken,
    getAccessTokenCookieOptions()
  );
  return response;
}

export function setRefreshToken(response: NextResponse, refreshToken: string) {
  response.cookies.set(
    "refreshToken",
    refreshToken,
    getRefreshTokenCookieOptions()
  );
  return response;
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  response.cookies.set(
    "accessToken",
    accessToken,
    getAccessTokenCookieOptions()
  );
  response.cookies.set(
    "refreshToken",
    refreshToken,
    getRefreshTokenCookieOptions()
  );
  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set("accessToken", "", {
    ...defaultCookieOptions,
    maxAge: 0,
  });
  response.cookies.set("refreshToken", "", {
    ...defaultCookieOptions,
    path: REFRESH_PATH,
    maxAge: 0,
  });
  return response;
}
