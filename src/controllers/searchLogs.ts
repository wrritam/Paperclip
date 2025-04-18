import { Request, Response } from "express";
import prisma from "../db/db.config";

interface SearchFilters {
  method?: string;
  url?: string;
  status?: number;
  startDate?: string;
  endDate?: string;
  minResponseTime?: number;
  maxResponseTime?: number;
  isError?: boolean;
}

interface CustomRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const searchLogs = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.email) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (!user || !user.is_verified) {
      res.status(403).json({ success: false, message: "User not verified" });
      return;
    }

    const filters: SearchFilters = req.query;

    const logs = await prisma.requestLog.findMany({
      where: {
        request: {
          userId: user.id,
          ...(filters.method && { method: filters.method.toUpperCase() }),
          ...(filters.url && { url: { contains: filters.url } }),
        },
        ...(filters.status && { status: parseInt(filters.status.toString()) }),
        ...(filters.isError !== undefined && { isError: filters.isError }),
        ...(filters.startDate && {
          createdAt: {
            gte: new Date(filters.startDate),
            ...(filters.endDate && { lte: new Date(filters.endDate) }),
          },
        }),
        ...(filters.minResponseTime && {
          responseTimeMs: {
            gte: parseInt(filters.minResponseTime.toString()),
            ...(filters.maxResponseTime && {
              lte: parseInt(filters.maxResponseTime.toString()),
            }),
          },
        }),
      },
      include: {
        request: {
          select: {
            method: true,
            url: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: logs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to search logs",
    });
  }
};
