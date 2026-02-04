import { Request, Response, NextFunction } from 'express';

export interface ValidationResult<T> {
  value?: T;
  errors?: Record<string, string>;
}

export type Validator<T> = (body: unknown) => ValidationResult<T>;

export const validateBody = <T>(validator: Validator<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = validator(req.body);
    if (result.errors) {
      res.status(400).json({ message: 'Validation error', errors: result.errors });
      return;
    }
    req.body = result.value;
    next();
  };
