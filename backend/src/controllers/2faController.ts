import { Request, Response } from 'express';
import User from "../models/userModel";
import { generateSecret, generateQRCode, verifyToken } from '../utils/GoogleAuthenticatorUtils';


// @desc Generate 2fa secret and QR code
// @route GET /api/2fa/generate
// @access Private
export const generate2fa  = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id);
  if(user){
    const secret = generateSecret(user.email);
    const qrCode = await generateQRCode(secret.otpauth_url);

    user.twoFaSecret = secret.base32; // Save this to the database
    const updatedUser = await user.save();

    res.status(200).json({
      qrCode,  // Send this to the frontend for the user to scan
      user: {
        _id: updatedUser._id,
        name: updatedUser.fullName,
        email: updatedUser.email,
      }
    });

  } else {
    res.status(404);
    throw new Error('User not found');
  }
  
};


// @desc Verify 2fa token with secret
// @route POST /api/2fa/verify
// @access Private
export const verify2fa = (req: Request, res: Response) => {
  const { token, secret } = req.body;

  const isVerified = verifyToken(token, secret);

  if (isVerified) {
    res.json({ success: true, message: 'OTP verified successfully!' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP!' });
  };
};