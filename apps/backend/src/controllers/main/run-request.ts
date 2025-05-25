import axios, { AxiosRequestHeaders } from "axios";
import { Response } from "express";
import prisma from "../../db/db.config";
import { getInsights } from "../../services/insights";
import { generateAISuggestionsForAPI } from "../../services/ai-suggestion";
import { CustomRequest } from "../../types";

const allowedMethods = ["GET", "POST", "PUT", "DELETE"];

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

  // Move request finding/creation outside try-catch
  let savedRequest = await prisma.request.findFirst({
    where: {
      userId: foundUser.id,
      method: method.toUpperCase(),
      url,
    },
    include: {
      aiTips: true,
    },
  });

  if (!savedRequest) {
    savedRequest = await prisma.request.create({
      data: {
        userId: foundUser.id,
        method: method.toUpperCase(),
        url,
        summary: "Initial request created",
      },
      include: {
        aiTips: true,
      },
    });
  }

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

    // Combine log creation with request update
    const [requestLog, totalLogs] = await Promise.all([
      prisma.requestLog.create({
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
      }),
      prisma.requestLog.count({
        where: { requestId: savedRequest.id },
      }),
    ]);

    // Only fetch insights if we have enough logs
    let insight = null;
    let aiAnalysis = null;
    if (totalLogs >= 5) {
      insight = await getInsights(savedRequest.id);

      if (insight) {
        // Check if we need to generate new AI analysis
        const shouldGenerateNewAnalysis =
          !savedRequest.summary || totalLogs % 5 === 0; // Generate new analysis every 5 requests

        if (shouldGenerateNewAnalysis) {
          aiAnalysis = await generateAISuggestionsForAPI(method, url, {
            avgResponseTime: insight.avgResponseTime,
            errorRate: insight.errorRate,
            slowestResponse: insight.slowestResponse,
            avgPayloadSizeKB: insight.avgPayloadSizeKB,
            statusCodeDistribution: insight.statusCodeDistribution as Record<
              string,
              number
            >,
          });

          // Update request with new AI analysis
          savedRequest = await prisma.request.update({
            where: { id: savedRequest.id },
            data: {
              summary: aiAnalysis.summary,
              aiTips: {
                deleteMany: {},
                create: aiAnalysis.tips.map((tip) => ({
                  title: tip.title,
                  description: tip.description,
                  codeSnippet: tip.codeSnippet,
                })),
              },
            },
            include: {
              aiTips: true,
            },
          });
        }
      }
    }

    // Return success response
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
      aiAnalysis: savedRequest
        ? {
            summary: savedRequest.summary,
            aiTips: savedRequest.aiTips,
          }
        : null,
    });
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Just create the log entry for the error
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

    res.status(500).json({
      message: "Request Failed",
      error: error.message || "Unknown error",
      meta: { method, url, ip, userAgent, timestamp: new Date().toISOString() },
      insight: null,
      aiAnalysis: null,
    });
  }
};
