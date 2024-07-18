import crypto from 'crypto';

const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('hex'); // 32 bytes converted to hexadecimal string
};

export const jwtSecret = process.env.JWT_SECRET || generateJWTSecret();
