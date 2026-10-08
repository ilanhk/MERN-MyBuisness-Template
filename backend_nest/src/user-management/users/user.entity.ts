import { User } from '@prisma/client';

export type AppUser = User;

export function sanitizeUser(
  user: AppUser,
): Omit<
  AppUser,
  | 'passwordHash'
  | 'refreshTokenHash'
  | 'refreshTokenExpiresAt'
  | 'resetPasswordTokenHash'
  | 'resetPasswordExpiresAt'
  | 'twoFaSecret'
> {
  const {
    passwordHash: _passwordHash,
    refreshTokenHash: _refreshTokenHash,
    refreshTokenExpiresAt: _refreshTokenExpiresAt,
    resetPasswordTokenHash: _resetPasswordTokenHash,
    resetPasswordExpiresAt: _resetPasswordExpiresAt,
    twoFaSecret: _twoFaSecret,
    ...safe
  } = user;
  return safe;
}
