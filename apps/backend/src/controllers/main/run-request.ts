import axios, { AxiosRequestHeaders } from "axios";
import { Response } from "express";
import { z } from "zod";
import prisma from "../../db/db.config";
import { getInsights } from "../../services/insights";
import { generateAISuggestionsForAPI } from "../../services/ai-suggestion";
import { CustomRequest } from "../../types";

const RunRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE", "get", "post", "put", "delete"]),
  url: z.string().url("Invalid URL format"),
  headers: z.record(z.string()).optional().default({}),
  body: z.any().optional().default({})
});

interface SuccessResponse {
  status: number;
  headers: any;
  body: any;
  responseTimeMs: number;
  responseSizeKB: number;
  meta: {
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  };
  insight: any | null;
  aiAnalysis: {
    summary: string;
    aiTips: Array<{
      title: string;
      description: string;
      codeSnippet: string | null;
    }>;
  } | null;
}

// Error response type
interface ErrorResponse {
  message: string;
  error?: string;
  errors?: any;
  meta?: {
    method?: string;
    url?: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  };
  insight?: null;
  aiAnalysis?: null;
}

export const runRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  // Validate request body with Zod
  const parseResult = RunRequestSchema.safeParse(req.body);

  if (!parseResult.success) {
    const errorResponse: ErrorResponse = {
      message: "Invalid request body format",
      errors: parseResult.error.format(),
    };
    res.status(400).json(errorResponse);
    return;
  }

  const { method, url, headers, body } = parseResult.data;

  // Check user authentication
  if (!req.user?.email) {
    const errorResponse: ErrorResponse = {
      message: "Unauthorized: No user found"
    };
    res.status(401).json(errorResponse);
    return;
  }

  // Find and verify user
  const foundUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!foundUser || !foundUser.is_verified) {
    const errorResponse: ErrorResponse = {
      message: "User not verified or not found"
    };
    res.status(403).json(errorResponse);
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
  const userAgent = req.headers["user-agent"] || "unknown";
  const startTime = Date.now();

  // Find or create request record
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
    // Make the actual HTTP request
    const response = await axios.request({
      method: method.toLowerCase(),
      url,
      headers,
      data: ["POST", "PUT"].includes(method.toUpperCase()) ? body : undefined,
      validateStatus: () => true, // Don't throw on HTTP error status codes
    });

    const responseTime = Date.now() - startTime;
    const responseSizeKB = Buffer.byteLength(JSON.stringify(response.data)) / 1024;

    // Create request log and get total log count
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

    // Generate insights and AI analysis if we have enough logs
    let insight = null;
    let aiAnalysis = null;

    if (totalLogs >= 5) {
      insight = await getInsights(savedRequest.id);

      if (insight) {
        // Generate new AI analysis every 5 requests or if no summary exists
        const shouldGenerateNewAnalysis = !savedRequest.summary || totalLogs % 5 === 0;

        if (shouldGenerateNewAnalysis) {
          aiAnalysis = await generateAISuggestionsForAPI(method, url, {
            avgResponseTime: insight.avgResponseTime,
            errorRate: insight.errorRate,
            slowestResponse: insight.slowestResponse,
            avgPayloadSizeKB: insight.avgPayloadSizeKB,
            statusCodeDistribution: insight.statusCodeDistribution as Record<string, number>,
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
    const successResponse: SuccessResponse = {
      status: response.status,
      headers: response.headers,
      body: response.data,
      responseTimeMs: responseTime,
      responseSizeKB: parseFloat(responseSizeKB.toFixed(2)),
      meta: {
        method: method.toUpperCase(),
        url,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      },
      insight,
      aiAnalysis: savedRequest
        ? {
            summary: savedRequest.summary,
            aiTips: savedRequest.aiTips.map(tip => ({
              title: tip.title,
              description: tip.description,
              codeSnippet: tip.codeSnippet,
            })),
          }
        : null,
    };

    res.status(200).json(successResponse);
  } catch (error: any) {
    const responseTime = Date.now() - startTime;

    // Log the error
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

    // Return error response
    const errorResponse: ErrorResponse = {
      message: "Request Failed",
      error: error.message || "Unknown error",
      meta: {
        method: method.toUpperCase(),
        url,
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
      },
      insight: null,
      aiAnalysis: null,
    };

    res.status(500).json(errorResponse);
  }
};
