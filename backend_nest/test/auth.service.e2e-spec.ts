import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from '../src/user-management/auth/auth.service';
import { AppUser } from '../src/user-management/users/user.entity';

describe('AuthService', () => {
  const user: AppUser = {
    id: '507f1f77-bcf8-6cd7-9943-904391011111',
    firstName: 'Test',
    lastName: 'User',
    fullName: 'Test User',
    email: 'test@example.com',
    passwordHash: 'hashed-password',
    role: Role.USER,
    isActive: true,
    companyId: null,
    departmentId: null,
    inEmailList: false,
    twoFaSecret: null,
    refreshTokenHash: null,
    refreshTokenExpiresAt: null,
    tokenVersion: 0,
    resetPasswordTokenHash: null,
    resetPasswordExpiresAt: null,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createResponse = (): Response => ({
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response);

  const createService = () => {
    const users = {
      findByEmail: jest.fn(),
      findByResetToken: jest.fn(),
      create: jest.fn(),
      matchesPassword: jest.fn(),
      save: jest.fn(),
      resetPassword: jest.fn(),
      rotateRefreshToken: jest.fn(),
      revokeAuthentication: jest.fn(),
    };
    const config = {
      get: jest.fn((name: string) => {
        const values: Record<string, string> = {
          ACCESS_TOKEN_NAME: 'access-token',
          REFRESH_TOKEN_NAME: 'refresh-token',
          JWT_SECRET_ACCESS: 'access-secret',
          JWT_SECRET_REFRESH: 'refresh-secret',
          NODE_ENV: 'development',
        };
        return values[name];
      }),
    };

    return {
      service: new AuthService(users as never, config as never),
      users,
    };
  };

  it('returns a safe user and sets cookies without exposing tokens', async () => {
    const { service, users } = createService();
    users.findByEmail.mockResolvedValue(null);
    users.create.mockResolvedValue({ ...user });
    users.save.mockImplementation(async (savedUser: AppUser) => savedUser);
    const response = createResponse();

    const result = await service.register(response, {
      firstName: 'Test',
      lastName: 'User',
      email: 'TEST@example.com',
      password: 'ValidPassword1!',
    });

    expect(result).toEqual({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      companyId: null,
      departmentId: null,
      inEmailList: false,
      isActive: true,
      twoFactorEnabled: false,
    });
    expect(result).not.toHaveProperty('accessToken');
    expect(result).not.toHaveProperty('refreshToken');
    expect(response.cookie).toHaveBeenCalledTimes(2);

    const savedUser = users.save.mock.calls[0][0] as AppUser;
    expect(savedUser.refreshTokenHash).toEqual(expect.any(String));
    expect(savedUser.refreshTokenExpiresAt).toEqual(expect.any(Date));
  });

  it('atomically rotates the refresh token', async () => {
    const { service, users } = createService();
    const response = createResponse();
    users.rotateRefreshToken.mockResolvedValue(true);

    const result = await service.refresh(
      response,
      { ...user, refreshTokenHash: 'current-hash' },
      'presented-refresh-token',
    );

    expect(result).not.toHaveProperty('accessToken');
    expect(users.rotateRefreshToken).toHaveBeenCalledWith(
      user.id,
      expect.any(String),
      expect.any(String),
      expect.any(Date),
    );
    expect(response.cookie).toHaveBeenCalledTimes(2);
  });

  it('rejects a refresh token that was already rotated', async () => {
    const { service, users } = createService();
    users.rotateRefreshToken.mockResolvedValue(false);

    await expect(
      service.refresh(createResponse(), user, 'old-refresh-token'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a neutral response for an unknown password-reset email', async () => {
    const { service, users } = createService();
    users.findByEmail.mockResolvedValue(null);

    await expect(
      service.forgotPassword({ email: 'unknown@example.com' }),
    ).resolves.toEqual({
      message:
        'If an account exists for that email, a reset link has been sent.',
    });
  });

  it('returns a consistent password-reset response', async () => {
    const { service, users } = createService();
    users.findByResetToken.mockResolvedValue(user);

    await expect(
      service.resetPassword({
        resetToken: 'reset-token',
        newPassword: 'NewValidPassword1!',
      }),
    ).resolves.toEqual({
      message: 'Password has been reset successfully.',
    });
    expect(users.resetPassword).toHaveBeenCalledWith(
      user,
      'NewValidPassword1!',
    );
  });

  it('rejects invalid two-factor authentication', async () => {
    const { service, users } = createService();
    users.findByEmail.mockResolvedValue({
      ...user,
      twoFaSecret: 'JBSWY3DPEHPK3PXP',
    });
    users.matchesPassword.mockResolvedValue(true);

    await expect(
      service.login(createResponse(), {
        email: user.email,
        password: 'ValidPassword1!',
        twoFaCode: '000000',
      }),
    ).rejects.toBeInstanceOf(HttpException);
  });
});
