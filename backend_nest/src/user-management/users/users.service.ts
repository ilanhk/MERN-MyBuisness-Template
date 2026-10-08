import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Role } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma.service';
import { RedisService } from '../../infrastructure/redis.service';
import { AppUser, sanitizeUser } from './user.entity';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

@Injectable()
export class UsersService {
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(email: string): Promise<AppUser | null> {
    return this.prisma.client.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  }

  async findById(id: string): Promise<AppUser | null> {
    if (!UUID_PATTERN.test(id)) return null;
    return this.prisma.client.user.findUnique({ where: { id } });
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    isEmployee?: boolean;
    inEmailList?: boolean;
  }): Promise<AppUser> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.client.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: data.role ?? (data.isEmployee ? Role.EMPLOYEE : Role.USER),
        inEmailList: Boolean(data.inEmailList),
      },
    });
  }

  async matchesPassword(user: AppUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  // Persists mutable user and authentication state after callers update the object.
  async save(user: AppUser): Promise<AppUser> {
    const updated = await this.prisma.client.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        isActive: user.isActive,
        companyId: user.companyId,
        departmentId: user.departmentId,
        inEmailList: user.inEmailList,
        twoFaSecret: user.twoFaSecret,
        refreshTokenHash: user.refreshTokenHash,
        refreshTokenExpiresAt: user.refreshTokenExpiresAt,
        tokenVersion: user.tokenVersion,
        resetPasswordTokenHash: user.resetPasswordTokenHash,
        resetPasswordExpiresAt: user.resetPasswordExpiresAt,
        lastLogin: user.lastLogin,
      },
    });
    await this.invalidateCaches(user.id);
    return updated;
  }

  async createGoogleUser(firstName: string, lastName: string, email: string): Promise<AppUser> {
    const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
    return this.prisma.client.user.create({
      data: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: email.toLowerCase().trim(),
        passwordHash: password,
        inEmailList: true,
      },
    });
  }

  async findByResetToken(tokenHash: string): Promise<AppUser | null> {
    return this.prisma.client.user.findFirst({
      where: {
        resetPasswordTokenHash: tokenHash,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });
  }

  async resetPassword(user: AppUser, password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    await this.prisma.client.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
        tokenVersion: { increment: 1 },
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    });
    await this.invalidateCaches(user.id);
  }

  async revokeAuthentication(userId: string): Promise<void> {
    await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
        tokenVersion: { increment: 1 },
      },
    });
    await this.invalidateCaches(userId);
  }

  async rotateRefreshToken(
    userId: string,
    currentHash: string,
    nextHash: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.prisma.client.user.updateMany({
      where: {
        id: userId,
        refreshTokenHash: currentHash,
      },
      data: {
        refreshTokenHash: nextHash,
        refreshTokenExpiresAt: expiresAt,
      },
    });

    if (result.count === 1) {
      await this.invalidateCaches(userId);
      return true;
    }

    return false;
  }

  async updateProfile(id: string, data: Record<string, unknown>): Promise<AppUser> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const update: Record<string, unknown> = {};
    if (typeof data.firstName === 'string' && data.firstName.trim()) update.firstName = data.firstName.trim();
    if (typeof data.lastName === 'string' && data.lastName.trim()) update.lastName = data.lastName.trim();
    if (typeof data.fullName === 'string' && data.fullName.trim()) update.fullName = data.fullName.trim();
    if (typeof data.email === 'string' && data.email.trim()) update.email = data.email.toLowerCase().trim();
    if (typeof data.inEmailList === 'boolean') update.inEmailList = data.inEmailList;
    if (typeof data.twoFaSecret === 'string' || data.twoFaSecret === null) update.twoFaSecret = data.twoFaSecret;

    if (typeof data.password === 'string') {
      if (data.password.length < 12) throw new BadRequestException({ message: 'Password must be at least 12 characters' });
      update.passwordHash = await bcrypt.hash(data.password, 10);
      update.tokenVersion = { increment: 1 };
    }

    const updated = await this.prisma.client.user.update({ where: { id }, data: update });
    await this.invalidateCaches(id);
    return updated;
  }

  async findAll(): Promise<
    Array<
      Omit<
        AppUser,
        | 'passwordHash'
        | 'refreshTokenHash'
        | 'refreshTokenExpiresAt'
        | 'resetPasswordTokenHash'
        | 'resetPasswordExpiresAt'
        | 'twoFaSecret'
      >
    >
  > {
    const users = await this.prisma.client.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map(sanitizeUser);
  }

  async findSafeById(
    id: string,
  ): Promise<
    Omit<
      AppUser,
      | 'passwordHash'
      | 'refreshTokenHash'
      | 'refreshTokenExpiresAt'
      | 'resetPasswordTokenHash'
      | 'resetPasswordExpiresAt'
      | 'twoFaSecret'
    > | null
  > {
    const user = await this.findById(id);
    return user ? sanitizeUser(user) : null;
  }

  async updateUser(id: string, data: Record<string, unknown>): Promise<AppUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ message: 'User not found' });

    const update: Record<string, unknown> = {};
    if (typeof data.firstName === 'string' && data.firstName.trim()) update.firstName = data.firstName.trim();
    if (typeof data.lastName === 'string' && data.lastName.trim()) update.lastName = data.lastName.trim();
    if (typeof data.fullName === 'string' && data.fullName.trim()) update.fullName = data.fullName.trim();
    if (typeof data.email === 'string' && data.email.trim()) update.email = data.email.toLowerCase().trim();
    if (typeof data.role === 'string' && Object.values(Role).includes(data.role as Role)) {
      update.role = data.role as Role;
      update.tokenVersion = { increment: 1 };
    }
    if (typeof data.inEmailList === 'boolean') update.inEmailList = data.inEmailList;
    if (typeof data.twoFaSecret === 'string' || data.twoFaSecret === null) update.twoFaSecret = data.twoFaSecret;
    if (typeof data.password === 'string' && data.password) {
      update.passwordHash = await bcrypt.hash(data.password, 10);
      update.tokenVersion = { increment: 1 };
    }

    const updatedUser = await this.prisma.client.user.update({ where: { id }, data: update });
    await this.invalidateCaches(id);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ message: 'User not found' });
    if (user.role === Role.SUPER_ADMIN) {
      throw new BadRequestException({ message: 'Cannot delete admin user' });
    }

    await this.prisma.client.user.delete({ where: { id } });
    await this.invalidateCaches(id);
  }

  private async invalidateCaches(id?: string): Promise<void> {
    const client = this.redis.getClient();
    if (!client) return;
    const keys = ['users'];
    if (id) keys.push(`user:${id}`, `userSafe:${id}`);
    await client.del(keys);
  }
}
