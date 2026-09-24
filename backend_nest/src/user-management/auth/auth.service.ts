import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import nodemailer = require('nodemailer');
import * as speakeasy from 'speakeasy';
import { RedisService } from '../../infrastructure/redis.service';
import { UserDocument } from '../users/user.schema';
import { UsersService } from '../users/users.service';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  async register(response: Response, body: Record<string, unknown>) {
    const firstName = this.requiredString(body.firstName, 'firstName');
    const lastName = this.requiredString(body.lastName, 'lastName');
    const email = this.requiredString(body.email, 'email');
    const password = this.requiredString(body.password, 'password');

    this.validatePassword(password);
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('User already exists');
    }

    const user = await this.users.create({
      firstName,
      lastName,
      email,
      password,
      isEmployee: Boolean(body.isEmployee),
      inEmailList: Boolean(body.inEmailList),
    });

    return this.authenticate(response, user);
  }

  async login(response: Response, body: Record<string, unknown>) {
    const email = this.requiredString(body.email, 'email');
    const password = this.requiredString(body.password, 'password');
    const user = await this.users.findByEmail(email);

    if (!user || !(await this.users.matchesPassword(user, password))) {
      throw new HttpException({ message: 'Invalid Email or Password' }, HttpStatus.UNAUTHORIZED);
    }

    if (user.twoFaSecret) {
      const twoFaCode = body.twoFaCode;
      if (typeof twoFaCode !== 'string' || !twoFaCode) {
        throw new HttpException({ message: '2FA code required' }, HttpStatus.BAD_REQUEST);
      }
      const isVerified = speakeasy.totp.verify({
        secret: user.twoFaSecret,
        encoding: 'base32',
        token: twoFaCode,
      });
      if (!isVerified) {
        throw new HttpException({ message: 'Invalid 2FA' }, HttpStatus.BAD_REQUEST);
      }
    }

    return this.authenticate(response, user);
  }

  async logout(response: Response, userId?: string) {
    if (userId && this.redis.getClient()) {
      await this.redis.getClient()?.del([`user:${userId}`, `userSafe:${userId}`, 'users']);
    }

    response.clearCookie(this.config.get<string>('ACCESS_TOKEN_NAME') ?? 'accesstoken');
    response.clearCookie(this.config.get<string>('REFRESH_TOKEN_NAME') ?? 'refreshtoken');
    return { message: 'Logged out successfully' };
  }

  async refresh(response: Response, user: UserDocument) {
    return this.authenticate(response, user);
  }

  async issueTokens(response: Response, user: UserDocument) {
    return this.authenticate(response, user);
  }

  async forgotPassword(body: Record<string, unknown>) {
    const email = this.requiredString(body.email, 'email');
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new HttpException({ message: 'User not found' }, HttpStatus.BAD_REQUEST);
    }

    const resetToken = randomBytes(32).toString('hex');
    user.resetPasswordToken = createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await this.users.save(user);

    const resetUrl = `${this.config.get<string>('BASE_URL')}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 465,
      secure: true,
      auth: {
        user: this.config.get<string>('OUTLOOK_EMAIL'),
        pass: this.config.get<string>('OUTLOOK_PASSWORD'),
      },
      tls: { rejectUnauthorized: true },
    });

    await transporter.sendMail({
      to: user.email,
      from: this.config.get<string>('OUTLOOK_EMAIL'),
      subject: 'Password Reset Request',
      text: `Please use this link to reset your password: ${resetUrl}`,
    });

    return { message: 'Password reset link sent to your email address' };
  }

  async resetPassword(body: Record<string, unknown>, routeToken?: string) {
    const resetToken = typeof body.resetToken === 'string' ? body.resetToken : routeToken;
    const newPassword = this.requiredString(body.newPassword, 'newPassword');
    if (!resetToken) {
      throw new HttpException({ message: 'Invalid or expired token' }, HttpStatus.BAD_REQUEST);
    }
    this.validatePassword(newPassword);

    const tokenHash = createHash('sha256').update(resetToken).digest('hex');
    const user = await this.users.findByResetToken(tokenHash);
    if (!user) {
      throw new HttpException({ message: 'Invalid or expired token' }, HttpStatus.BAD_REQUEST);
    }

    await this.users.resetPassword(user, newPassword);
    return 'Password has been reset successfully.';
  }

  private async authenticate(response: Response, user: UserDocument) {
    const accessToken = this.createToken(user.id, 'JWT_SECRET_ACCESS', '15m');
    const refreshToken = this.createToken(user.id, 'JWT_SECRET_REFRESH', '3d');
    user.refreshToken = refreshToken;
    await this.users.save(user);

    if (this.redis.getClient()) {
      await this.redis.getClient()?.set(`user:${user.id}`, JSON.stringify(user), { EX: CACHE_TTL_SECONDS });
    }

    this.setCookie(response, 'ACCESS_TOKEN_NAME', accessToken, 15 * 60 * 1000);
    this.setCookie(response, 'REFRESH_TOKEN_NAME', refreshToken, 3 * 24 * 60 * 60 * 1000);

    return this.publicUser(user, accessToken, refreshToken);
  }

  private createToken(userId: string, secretName: string, expiresIn: jwt.SignOptions['expiresIn']): string {
    const secret = this.config.get<string>(secretName);
    if (!secret) {
      throw new Error(`${secretName} must be set before using authentication.`);
    }
    return jwt.sign({ userId }, secret, { expiresIn });
  }

  private setCookie(response: Response, name: string, value: string, maxAge: number): void {
    const cookieName = this.config.get<string>(name);
    if (!cookieName) {
      throw new Error(`${name} must be set before using authentication.`);
    }
    response.cookie(cookieName, value, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') !== 'development',
      sameSite: 'strict',
      maxAge,
    });
  }

  private publicUser(user: UserDocument, accessToken?: string, refreshToken?: string) {
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      isEmployee: user.isEmployee,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      inEmailList: user.inEmailList,
      ...(accessToken ? { accessToken } : {}),
      ...(refreshToken ? { refreshToken } : {}),
    };
  }

  private requiredString(value: unknown, field: string): string {
    if (typeof value !== 'string' || !value.trim()) {
      throw new BadRequestException(`${field} is required`);
    }
    return value.trim();
  }

  private validatePassword(password: string): void {
    if (!/^\S{12,}$/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
      throw new BadRequestException('Password must be at least 12 characters and include uppercase, lowercase, number, and special character.');
    }
  }
}
