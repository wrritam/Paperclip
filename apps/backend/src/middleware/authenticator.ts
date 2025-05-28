import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types";

export const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Access denied - No token provided" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.ENCRYPTION_KEY || "");

    if (typeof verified === 'object' && verified !== null && 'email' in verified) {
      req.user = verified as any;
      next();
    } else {
      console.error('❌ Invalid token payload structure');
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({
      message: "Invalid token",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};
