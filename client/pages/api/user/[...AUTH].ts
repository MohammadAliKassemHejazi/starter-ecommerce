// pages/api/auth/[...AUTH].ts

import { HTTP_METHOD_POST, HTTP_METHOD_GET, ACCESS_TOKEN_KEY } from "@/utils/constant";
import { clearCookie, setCookie } from "@/utils/cookiesUtil";
import httpClient from "@/utils/httpClient";
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const action = req.query.AUTH?.[1] as string | undefined;
console.log(`API auth action: ${action}, method: ${req.method}`);
  if (req.method === HTTP_METHOD_POST && action === "login") {
    return handleSignIn(req, res);
  } else if (req.method === HTTP_METHOD_POST && action === "register") {
    return handleSignUp(req, res);
  } else if (req.method === HTTP_METHOD_POST && action === "logout") {
    return handleSignOut(req, res);
  }  else if (req.method === HTTP_METHOD_GET && action === "session") {
    return handleGetSession(req, res);
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}

// === Handlers ===

const handleSignIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Forward to real backend
    const response = await httpClient.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/login`, req.body);
  const { accessToken, ...userData } = response.data.data;

    // Set HTTP-only cookie
    setCookie(res, ACCESS_TOKEN_KEY, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    // Return user data (without token)
    res.status(200).json(userData);
  } catch (error: any) {
    console.error("Sign-in error:", error.response?.data || error.message);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

const handleSignUp = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await httpClient.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/register`, req.body);
    res.status(201).json(response.data);
  } catch (error: any) {
    console.error("Sign-up error:", error.response?.data || error.message);
    res.status(400).json({ error: error.response?.data?.message || "Registration failed" });
  }
};

const handleGetSession = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("Handling get session");
    // Extract token from cookies 

    const cookies = cookie.parse(req.headers.cookie || "");
    const accessToken = cookies[ACCESS_TOKEN_KEY];

    if (!accessToken) {
      return res.status(401).json({ error: "No session" });
    }

    const response = await httpClient.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/isauthenticated`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error("Session error:", error.response?.data || error.message);
    // Clear invalid cookie
    clearCookie(res, ACCESS_TOKEN_KEY);
    res.status(401).json({ error: "Session invalid" });
  }
};



const handleSignOut = async (_req: NextApiRequest, res: NextApiResponse) => {
  clearCookie(res, ACCESS_TOKEN_KEY);
  console.log("User signed out, cookie cleared");
  res.status(200).json({ success: true, message: "Signed out" });
};