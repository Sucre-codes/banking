import { ValidationResult } from '../middleware/validate.js';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isEmail = (value: string) => /.+@.+\..+/.test(value);

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
  return null;
};

export const registerSchema = (body: unknown): ValidationResult<{ name: string; email: string; password: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { name, email, password } = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (!isNonEmptyString(name) || name.trim().length < 2) errors.name = 'Name is required';
  if (!isNonEmptyString(email) || !isEmail(email)) errors.email = 'Valid email is required';
  if (!isNonEmptyString(password) || password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { name: name.trim(), email: email.toLowerCase(), password } };
};

export const loginSchema = (body: unknown): ValidationResult<{ email: string; password: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { email, password } = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (!isNonEmptyString(email) || !isEmail(email)) errors.email = 'Valid email is required';
  if (!isNonEmptyString(password) || password.length < 8) errors.password = 'Password must be at least 8 characters';
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { email: email.toLowerCase(), password } };
};

const moneySchema = (body: unknown): ValidationResult<{ amountCents: number }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { amountCents } = body as Record<string, unknown>;
  const amountValue = asNumber(amountCents);
  if (!amountValue || !Number.isInteger(amountValue) || amountValue <= 0) {
    return { errors: { amountCents: 'Amount must be a positive integer' } };
  }
  return { value: { amountCents: amountValue } };
};

export const depositSchema = moneySchema;

export const withdrawSchema = moneySchema;

export const transferSchema = (body: unknown): ValidationResult<{ amountCents: number; toAccountNumber: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { amountCents, toAccountNumber } = body as Record<string, unknown>;
  const base = moneySchema({ amountCents });
  const errors = { ...(base.errors ?? {}) } as Record<string, string>;
  if (!isNonEmptyString(toAccountNumber) || toAccountNumber.trim().length < 6) {
    errors.toAccountNumber = 'Recipient account number is required';
  }
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { amountCents: base.value!.amountCents, toAccountNumber: toAccountNumber.trim() } };
};
