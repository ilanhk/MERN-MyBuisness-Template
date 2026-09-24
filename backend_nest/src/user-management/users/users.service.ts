import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { RedisService } from '../../infrastructure/redis.service';
import { UserDocument, UserModel } from './user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly redis: RedisService) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).exec();
  }

  async create(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isEmployee?: boolean;
    inEmailList?: boolean;
  }): Promise<UserDocument> {
    const password = await bcrypt.hash(data.password, 10);
    return UserModel.create({
      ...data,
      email: data.email.toLowerCase().trim(),
      fullName: `${data.firstName} ${data.lastName}`,
      password,
    });
  }

  async matchesPassword(user: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }

  async createGoogleUser(firstName: string, lastName: string, email: string): Promise<UserDocument> {
    const password = await bcrypt.hash(randomBytes(32).toString('hex'), 10);
    return UserModel.create({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      email: email.toLowerCase().trim(),
      password,
      inEmailList: true,
    });
  }

  async findByResetToken(tokenHash: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    }).exec();
  }

  async resetPassword(user: UserDocument, password: string): Promise<void> {
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    await this.invalidateCaches(user.id);
  }

  async updateProfile(id: string, data: Record<string, unknown>): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    if (typeof data.firstName === 'string' && data.firstName.trim()) user.firstName = data.firstName.trim();
    if (typeof data.lastName === 'string' && data.lastName.trim()) user.lastName = data.lastName.trim();
    if (typeof data.fullName === 'string' && data.fullName.trim()) user.fullName = data.fullName.trim();
    if (typeof data.email === 'string' && data.email.trim()) user.email = data.email.toLowerCase().trim();
    if (typeof data.inEmailList === 'boolean') user.inEmailList = data.inEmailList;
    if (typeof data.twoFaSecret === 'string' || data.twoFaSecret === null) user.twoFaSecret = data.twoFaSecret;

    if (typeof data.password === 'string') {
      if (data.password.length < 12) throw new BadRequestException({ message: 'Password must be at least 12 characters' });
      user.password = await bcrypt.hash(data.password, 10);
    }

    return user.save();
  }

  async findAll() {
    return UserModel.find().select('-password -refreshToken').lean().exec();
  }

  async findSafeById(id: string) {
    return UserModel.findById(id).select('-password -refreshToken').lean().exec();
  }

  async updateUser(id: string, data: Record<string, unknown>): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ message: 'User not found' });

    if (typeof data.firstName === 'string' && data.firstName.trim()) user.firstName = data.firstName.trim();
    if (typeof data.lastName === 'string' && data.lastName.trim()) user.lastName = data.lastName.trim();
    if (typeof data.fullName === 'string' && data.fullName.trim()) user.fullName = data.fullName.trim();
    if (typeof data.email === 'string' && data.email.trim()) user.email = data.email.toLowerCase().trim();
    if (typeof data.isEmployee === 'boolean') user.isEmployee = data.isEmployee;
    if (typeof data.isAdmin === 'boolean') user.isAdmin = data.isAdmin;
    if (typeof data.isSuperAdmin === 'boolean') user.isSuperAdmin = data.isSuperAdmin;
    if (typeof data.inEmailList === 'boolean') user.inEmailList = data.inEmailList;
    if (typeof data.twoFaSecret === 'string' || data.twoFaSecret === null) user.twoFaSecret = data.twoFaSecret;
    if (typeof data.password === 'string' && data.password) user.password = await bcrypt.hash(data.password, 10);

    const updatedUser = await user.save();
    await this.invalidateCaches(id);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException({ message: 'User not found' });
    if (user.isSuperAdmin) throw new BadRequestException({ message: 'Cannot delete admin user' });

    await UserModel.deleteOne({ _id: id }).exec();
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
