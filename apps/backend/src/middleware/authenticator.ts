import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomRequest } from "../types";
import { User } from "@prisma/client";

function isUserFromJwt(payload: string | jwt.JwtPayload): payload is User {
  return (
    typeof payload === "object" &&
    payload !== null &&
    typeof payload.id === "string" &&
    (typeof payload.name === "string" || payload.name === null) &&
    typeof payload.email === "string" &&
    typeof payload.password === "string" &&
    typeof payload.is_verified === "boolean" &&
    (typeof payload.otp === "number" || payload.otp === null) &&
    (typeof payload.last_login === "string" || payload.last_login === null) &&
    typeof payload.createdAt === "string" &&
    typeof payload.updatedAt === "string"
  );
}
export const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ message: "Access denied" });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.hiddenKey || "");

    if (isUserFromJwt(verified)) {
      req.user = verified;
      next();
    } else {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
