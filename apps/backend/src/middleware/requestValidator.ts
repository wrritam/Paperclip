import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const runRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  url: z.string().url(),
  headers: z.record(z.string()).optional(),
  body: z.any().optional(),
});

const searchLogsSchema = z.object({
  method: z.string().optional(),
  url: z.string().optional(),
  status: z.string().regex(/^\d+$/).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minResponseTime: z.string().regex(/^\d+$/).optional(),
  maxResponseTime: z.string().regex(/^\d+$/).optional(),
  isError: z.enum(["true", "false"]).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  sortBy: z.enum(["responseTimeMs", "createdAt", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

const deleteRequestSchema = z.object({
  requestId: z.string().uuid(),
});

export const validateRunRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    runRequestSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid request data",
      details: error instanceof z.ZodError ? error.errors : "Validation failed",
    });
  }
};

export const validateSearchLogs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    searchLogsSchema.parse(req.query);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid search parameters",
      details: error instanceof z.ZodError ? error.errors : "Validation failed",
    });
  }
};

export const validateDeleteRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    deleteRequestSchema.parse({ requestId: req.params.requestId });
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid request ID",
      details: error instanceof z.ZodError ? error.errors : "Validation failed",
    });
  }
};

const allInsightsSchema = z.object({
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
  sortBy: z
    .enum(["avgResponseTime", "errorRate", "lastAccessed", "totalRequests"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  method: z.string().optional(),
  url: z.string().optional(),
});

export const validateAllInsights = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    allInsightsSchema.parse(req.query);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid insights parameters",
      details: error instanceof z.ZodError ? error.errors : "Validation failed",
    });
  }
};
