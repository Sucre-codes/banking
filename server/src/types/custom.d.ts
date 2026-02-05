import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
declare module "express";
declare module "jsonwebtoken";
