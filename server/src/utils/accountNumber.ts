export const generateAccountNumber = (): string => {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `ACCT-${randomPart}`;
};
