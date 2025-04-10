import { Request, Response } from "express";
import prisma from "../db/db.config";

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const deleteRequest = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const requestId = req.params.requestId;

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

  const requestToDelete = await prisma.request.findFirst({
    where: {
      id: requestId,
      userId: foundUser.id,
    },
  });

  if (!requestToDelete) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  await prisma.requestLog.deleteMany({
    where: { requestId },
  });

  await prisma.insight.deleteMany({
    where: { requestId },
  });

  await prisma.request.delete({
    where: { id: requestId },
  });

  res
    .status(200)
    .json({ message: "Request and related data deleted successfully" });
};
