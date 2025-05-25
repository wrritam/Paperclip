import { Response } from "express";
import { CustomRequest } from "../../types";
import prisma from "../../db/db.config";
import { getGroupedInsights } from "../../services/group-insights";

export const allInsights = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user?.email) {
      console.log("No email in token");
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    console.log("Found user:", foundUser);

    if (!foundUser || !foundUser.is_verified) {
      res
        .status(403)
        .json({ success: false, message: "User not verified or not found" });
      return;
    }

    const insights = await getGroupedInsights(foundUser.id);
    res.json({ success: true, data: insights });
  } catch (error: any) {
    console.error("Error fetching grouped insights:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch grouped insights",
    });
  }
};
