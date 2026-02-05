import { Request, Response, NextFunction } from 'express';

export type ValidationResult<T> = { value: T; errors?: never } | { errors: Record<string, string>; value?: never };

export const validateBody = <T>(schema: (body: unknown) => ValidationResult<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema(req.body);
    if (result.errors) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }
    // Create a new object with validated data
    (req as any).body = result.value;
    next();
  };