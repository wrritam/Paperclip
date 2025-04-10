import axios, { AxiosRequestHeaders } from "axios";
import { Request, Response } from "express";
import prisma from "../db/db.config";
import { getInsights } from "../services/insights";

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

  if (!method || !url) {
    res.status(400).json({ message: "Method and URL are required" });
    return;
  }

  if (!allowedMethods.includes(method.toUpperCase())) {
    res.status(400).json({
      message: "Only GET, POST, PUT, and DELETE methods are allowed for now",
    });
    return;
  }

  if (!req.user?.email) {
    res.status(401).json({ message: "Unauthorized: No user found" });
    return;
  }

  const foundUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!foundUser || !foundUser.is_verified) {
    res.status(403).json({ message: "User not verified or not found" });
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
      validateStatus: () => true,
    });

    const responseTime = Date.now() - startTime;
    const responseSizeKB =
      Buffer.byteLength(JSON.stringify(response.data)) / 1024;

    // Find or create saved request
    let savedRequest = await prisma.request.findFirst({
      where: {
        userId: foundUser.id,
        method: method.toUpperCase(),
        url,
      },
    });

    if (!savedRequest) {
      savedRequest = await prisma.request.create({
        data: {
          userId: foundUser.id,
          method: method.toUpperCase(),
          url,
        },
      });
    }

    // Create log entry
    await prisma.requestLog.create({
      data: {
        requestId: savedRequest.id,
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

    // Check if this is the 5th (or later) log and generate insight
    const totalLogs = await prisma.requestLog.count({
      where: { requestId: savedRequest.id },
    });

    let insight = null;
    if (totalLogs >= 5) {
      insight = await getInsights(savedRequest.id);
    }

    // Return final response
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
      insight,
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    let savedRequest = await prisma.request.findFirst({
      where: {
        userId: foundUser.id,
        method: method.toUpperCase(),
        url,
      },
    });

    if (!savedRequest) {
      savedRequest = await prisma.request.create({
        data: {
          userId: foundUser.id,
          method: method.toUpperCase(),
          url,
        },
      });
    }

    await prisma.requestLog.create({
      data: {
        requestId: savedRequest.id,
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

    // Same logic: try generating insight after 5 logs
    const totalLogs = await prisma.requestLog.count({
      where: { requestId: savedRequest.id },
    });

    let insight = null;
    if (totalLogs >= 5) {
      insight = await getInsights(savedRequest.id);
    }

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
      insight,
    });
  }
};
