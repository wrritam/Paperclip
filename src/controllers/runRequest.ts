import axios, { AxiosRequestHeaders } from "axios";
import { Request, Response } from "express";

const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

interface RunRequestBody {
  method: string;
  url: string;
  headers?: AxiosRequestHeaders;
  body?: any;
}

export const runRequest = async (
  req: Request<{}, {}, RunRequestBody>,
  res: Response
): Promise<void> => {
  const { method, url, headers = {}, body = {} } = req.body;

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

  // Capture IP and User-Agent
  const ip = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "") as string;

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
    });
  } catch (error: any) {
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
