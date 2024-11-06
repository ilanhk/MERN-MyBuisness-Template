const speakeasy = require('speakeasy'); // cant use import because it doesnt have something officially for TS yet.
import QRCode from 'qrcode';

// Function to generate a secret key for a user
export const generateSecret = (user: string) => {
  const secret = speakeasy.generateSecret({
    name: `MyBusiness (${user})`,
    length: 40,
  });

  return secret;
};

// Generate a QR code based on the secret
export const generateQRCode = async (otpauthUrl: string): Promise<string> => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);
    return qrCodeDataUrl;
  } catch (err) {
    throw new Error('Error generating QR code');
  }
};

// Function to verify the token from Google Authenticator
export const verifyToken = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
  });
};