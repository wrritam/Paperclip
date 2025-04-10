import { Request, Response } from "express";
import prisma from "../db/db.config";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const deleteRequest = async (req: CustomRequest, res: Response) => {
  const { method, url } = req.body;

  if (!method || !url) {
    return res.status(400).json({ message: "Method and URL are required" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const endpoint = `${method.toUpperCase()} ${url}`;

  try {
    // Delete all matching request logs
    await prisma.requestLog.deleteMany({
      where: {
        userId: req.user.id,
        method: method.toUpperCase(),
        url,
      },
    });

    // Delete matching insight
    await prisma.insight.deleteMany({
      where: {
        userId: req.user.id,
        endpoint,
      },
    });

    return res.status(200).json({
      message: `Successfully deleted logs and insights for ${endpoint}`,
    });
  } catch (error: any) {
    console.error("Error deleting endpoint logs/insight:", error);
    return res.status(500).json({
      message: "Failed to delete endpoint data",
      error: error.message,
    });
  }
};
