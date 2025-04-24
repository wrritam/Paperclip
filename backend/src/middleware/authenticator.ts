import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  email: string;
  name: string | null;
  password: string;
  is_verified: boolean;
  otp: number | null;
  last_login: string | null;
  created_at: string;
  updated_at: string | null;
}

interface CustomRequest extends Request {
  user?: User;
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
    const verified = jwt.verify(token, process.env.hiddenKey || "") as User;
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
};
