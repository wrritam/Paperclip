import axios, { AxiosRequestHeaders } from "axios";
import { Request, Response } from "express";
import prisma from "../db/db.config";
import { getInsights } from "../services/insights"; // Insight generator

const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

interface RunRequestBody {
  method: string;
  url: string;
  headers?: AxiosRequestHeaders;
  body?: any;
}

export const runRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const { method, url, headers = {}, body = {} } = req.body as RunRequestBody;

  // Validate method and URL
  if (!method || !url) {
    res.status(400).json({ message: "Method and URL are required" });
    return;
  }

  if (!allowedMethods.includes(method.toUpperCase())) {
    res.status(400).json({
      message: "Only GET, POST, PUT and DELETE methods are allowed for now",
    });
    return;
  }

  // Validate user
  if (!req.user?.email) {
    res.status(401).json({ message: "Unauthorized: No user found" });
    return;
  }

  const foundUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!foundUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (!foundUser.is_verified) {
    res.status(403).json({ message: "Please verify your email address" });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "";

  const userAgent = req.headers["user-agent"] || "unknown";

  const startTime = Date.now();

  try {
    const response = await axios.request({
      method,
      url,
      headers,
      data: ["POST", "PUT"].includes(method.toUpperCase()) ? body : undefined,
      validateStatus: () => true, // Log all responses
    });

    const responseTime = Date.now() - startTime;
    const responseSizeKB =
      Buffer.byteLength(JSON.stringify(response.data)) / 1024;

    // Save request log
    await prisma.requestLog.create({
      data: {
        userId: foundUser.id,
        method,
        url,
        status: response.status,
        responseTimeMs: responseTime,
        responseSizeKB: parseFloat(responseSizeKB.toFixed(2)),
        headers: response.headers,
        responseBody: response.data,
        ipAddress: ip,
        userAgent,
        isError: response.status >= 400,
      },
    });

    // insight create or refine the existing shit
    const insight = await getInsights(foundUser.id, method, url);
    console.log("*************************************");
    console.log(insight);

    // Response
    res.status(200).json({
      status: response.status,
      headers: response.headers,
      body: response.data,
      responseTimeMs: responseTime,
      responseSizeKB: parseFloat(responseSizeKB.toFixed(2)),
      meta: {
        method,
        url,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      },
      insight: insight,
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log failed request
    await prisma.requestLog.create({
      data: {
        userId: foundUser.id,
        method,
        url,
        status: 500,
        responseTimeMs: responseTime,
        responseSizeKB: 0,
        headers: {},
        responseBody: { error: error.message || "Unknown error" },
        ipAddress: ip,
        userAgent,
        isError: true,
      },
    });

    res.status(500).json({
      message: "Request Failed",
      error: error.message || "Unknown error",
      meta: {
        method,
        url,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      },
    });
  }
};
