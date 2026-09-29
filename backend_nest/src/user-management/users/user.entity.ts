import { User } from '@prisma/client';

export type AppUser = User;

export function sanitizeUser(user: AppUser): Omit<AppUser, 'password' | 'refreshToken'> {
  const { password: _password, refreshToken: _refreshToken, ...safe } = user;
  return safe;
}
