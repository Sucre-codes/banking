import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  userId?: string; // make optional so it's not required everywhere
  user?: {
    id: string;
    email: string;
    // add other fields you attach to req.user
  };
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization; // ✅ headers exists now
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId; // ✅ attach decoded info
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
