import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
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
    isEmployee?: boolean;
    inEmailList?: boolean;
  }): Promise<AppUser> {
    const password = await bcrypt.hash(data.password, 10);
    return this.prisma.client.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase().trim(),
        password,
        isEmployee: Boolean(data.isEmployee),
        inEmailList: Boolean(data.inEmailList),
      },
    });
  }

  async matchesPassword(user: AppUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  // Persists every mutable field on `user`; callers mutate the plain object then call save().
  async save(user: AppUser): Promise<AppUser> {
    const updated = await this.prisma.client.user.update({
      where: { id: user.id },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        isEmployee: user.isEmployee,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
        inEmailList: user.inEmailList,
        twoFaSecret: user.twoFaSecret,
        refreshToken: user.refreshToken,
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordExpires: user.resetPasswordExpires,
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
        password,
        inEmailList: true,
      },
    });
  }

  async findByResetToken(tokenHash: string): Promise<AppUser | null> {
    return this.prisma.client.user.findFirst({
      where: {
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { gt: new Date() },
      },
    });
  }

  async resetPassword(user: AppUser, password: string): Promise<void> {
    const hashed = await bcrypt.hash(password, 10);
    await this.prisma.client.user.update({
      where: { id: user.id },
      data: { password: hashed, resetPasswordToken: null, resetPasswordExpires: null },
    });
    await this.invalidateCaches(user.id);
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
      update.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await this.prisma.client.user.update({ where: { id }, data: update });
    await this.invalidateCaches(id);
    return updated;
  }

  async findAll(): Promise<Array<Omit<AppUser, 'password' | 'refreshToken'>>> {
    const users = await this.prisma.client.user.findMany({ orderBy: { createdAt: 'desc' } });
    return users.map(sanitizeUser);
  }

  async findSafeById(id: string): Promise<Omit<AppUser, 'password' | 'refreshToken'> | null> {
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
    if (typeof data.isEmployee === 'boolean') update.isEmployee = data.isEmployee;
    if (typeof data.isAdmin === 'boolean') update.isAdmin = data.isAdmin;
    if (typeof data.isSuperAdmin === 'boolean') update.isSuperAdmin = data.isSuperAdmin;
    if (typeof data.inEmailList === 'boolean') update.inEmailList = data.inEmailList;
    if (typeof data.twoFaSecret === 'string' || data.twoFaSecret === null) update.twoFaSecret = data.twoFaSecret;
    if (typeof data.password === 'string' && data.password) update.password = await bcrypt.hash(data.password, 10);

    const updatedUser = await this.prisma.client.user.update({ where: { id }, data: update });
    await this.invalidateCaches(id);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ message: 'User not found' });
    if (user.isSuperAdmin) throw new BadRequestException({ message: 'Cannot delete admin user' });

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
