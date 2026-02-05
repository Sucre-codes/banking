import { ValidationResult } from '../middleware/validate.js';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isEmail = (value: string) => /.+@.+\..+/.test(value);

const asNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) return Number(value);
  return null;
};

const pinRegex = /^\d{4}$/;

export const registerSchema = (body: unknown): ValidationResult<{ name: string; email: string; password: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { name, email, password } = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (!isNonEmptyString(name) || (name as string).trim().length < 2) errors.name = 'Name is required';
  if (!isNonEmptyString(email) || !isEmail(email as string)) errors.email = 'Valid email is required';
  if (!isNonEmptyString(password) || (password as string).length < 8) errors.password = 'Password must be at least 8 characters';
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { name: (name as string).trim(), email: (email as string).toLowerCase(), password: password as string } };
};

export const loginSchema = (body: unknown): ValidationResult<{ identifier: string; password: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { identifier, password } = body as Record<string, unknown>;
  const errors: Record<string, string> = {};
  if (!isNonEmptyString(identifier)) errors.identifier = 'Account number or user ID is required';
  if (!isNonEmptyString(password) || (password as string).length < 8) errors.password = 'Password must be at least 8 characters';
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { identifier: (identifier as string).trim(), password: password as string } };
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

export const pinSchema = (body: unknown): ValidationResult<{ pin: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { pin } = body as Record<string, unknown>;
  if (!isNonEmptyString(pin) || !pinRegex.test(pin as string)) {
    return { errors: { pin: 'PIN must be 4 digits' } };
  }
  return { value: { pin: pin as string } };
};

export const depositSchema = (body: unknown): ValidationResult<{ amountCents: number; keyword?: string }> => {
  const base = moneySchema(body);
  if (base.errors) return base as ValidationResult<{ amountCents: number; keyword?: string }>;
  const { keyword } = body as Record<string, unknown>;
  if (keyword !== undefined && !isNonEmptyString(keyword)) {
    return { errors: { keyword: 'Keyword must be a non-empty string' } };
  }
  return { value: { amountCents: base.value!.amountCents, keyword: keyword ? (keyword as string).trim() : undefined } };
};

export const withdrawSchema = (body: unknown): ValidationResult<{
  amountCents: number;
  pin: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  beneficiaryRoutingNumber?: string;
  beneficiarySwiftCode?: string;
  beneficiaryIbanNumber?: string;
}> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { 
    amountCents, 
    pin, 
    beneficiaryName, 
    beneficiaryEmail, 
    beneficiaryBank, 
    beneficiaryAccount,
    beneficiaryRoutingNumber,
    beneficiarySwiftCode,
    beneficiaryIbanNumber
  } = body as Record<string, unknown>;
  
  const base = moneySchema({ amountCents });
  const errors = { ...(base.errors ?? {}) } as Record<string, string>;
  
  if (!isNonEmptyString(pin) || !pinRegex.test(pin as string)) errors.pin = 'PIN must be 4 digits';
  if (!isNonEmptyString(beneficiaryName)) errors.beneficiaryName = 'Beneficiary name is required';
  if (!isNonEmptyString(beneficiaryEmail) || !isEmail(beneficiaryEmail as string)) errors.beneficiaryEmail = 'Valid beneficiary email is required';
  if (!isNonEmptyString(beneficiaryBank)) errors.beneficiaryBank = 'Beneficiary bank is required';
  if (!isNonEmptyString(beneficiaryAccount)) errors.beneficiaryAccount = 'Beneficiary account is required';
  
  if (Object.keys(errors).length > 0) return { errors };
  
  return {
    value: {
      amountCents: base.value!.amountCents,
      pin: pin as string,
      beneficiaryName: (beneficiaryName as string).trim(),
      beneficiaryEmail: (beneficiaryEmail as string).toLowerCase(),
      beneficiaryBank: (beneficiaryBank as string).trim(),
      beneficiaryAccount: (beneficiaryAccount as string).trim(),
      // Optional fields - only include if they exist and are non-empty strings
      ...(isNonEmptyString(beneficiaryRoutingNumber) && { beneficiaryRoutingNumber: (beneficiaryRoutingNumber as string).trim() }),
      ...(isNonEmptyString(beneficiarySwiftCode) && { beneficiarySwiftCode: (beneficiarySwiftCode as string).trim() }),
      ...(isNonEmptyString(beneficiaryIbanNumber) && { beneficiaryIbanNumber: (beneficiaryIbanNumber as string).trim() })
    }
  };
};

export const transferSchema = (body: unknown): ValidationResult<{ amountCents: number; toAccountNumber: string; pin: string }> => {
  if (!body || typeof body !== 'object') {
    return { errors: { body: 'Invalid payload' } };
  }
  const { amountCents, toAccountNumber, pin } = body as Record<string, unknown>;
  const base = moneySchema({ amountCents });
  const errors = { ...(base.errors ?? {}) } as Record<string, string>;
  
  if (!isNonEmptyString(toAccountNumber) || !/^\d{10}$/.test((toAccountNumber as string).trim())) {
    errors.toAccountNumber = 'Recipient account number must be 10 digits';
  }
  if (!isNonEmptyString(pin) || !pinRegex.test(pin as string)) errors.pin = 'PIN must be 4 digits';
  
  if (Object.keys(errors).length > 0) return { errors };
  return { value: { amountCents: base.value!.amountCents, toAccountNumber: (toAccountNumber as string).trim(), pin: pin as string } };
};

export const externalTransferSchema = (body: unknown): ValidationResult<{
  amountCents: number;
  pin: string;
  beneficiaryName: string;
  beneficiaryEmail: string;
  beneficiaryBank: string;
  beneficiaryAccount: string;
  beneficiaryRoutingNumber?: string;
  beneficiarySwiftCode?: string;
  beneficiaryIbanNumber?: string;
}> => {
  return withdrawSchema(body);
};