import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class TwoFaService {
  constructor(private readonly users: UsersService) {}

  async generate(user: UserDocument) {
    const storedUser = await this.users.findById(user.id);
    if (!storedUser) throw new NotFoundException({ message: 'User not found' });

    const secret = speakeasy.generateSecret({
      name: `MyBusiness (${storedUser.email})`,
      length: 40,
    });
    if (!secret.otpauth_url || !secret.base32) {
      throw new Error('Unable to generate 2FA secret.');
    }

    storedUser.twoFaSecret = secret.base32;
    const updatedUser = await this.users.save(storedUser);
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    return {
      qrCode,
      user: {
        _id: updatedUser._id,
        name: updatedUser.fullName,
        email: updatedUser.email,
        inEmailList: updatedUser.inEmailList,
      },
    };
  }

  verify(token: unknown, secret: unknown) {
    if (typeof token !== 'string' || typeof secret !== 'string') {
      throw new BadRequestException({ success: false, message: 'Invalid OTP!' });
    }

    const isVerified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });

    if (!isVerified) {
      throw new BadRequestException({ success: false, message: 'Invalid OTP!' });
    }

    return { success: true, message: 'OTP verified successfully!' };
  }
}
