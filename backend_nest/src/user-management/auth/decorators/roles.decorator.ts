import { SetMetadata } from '@nestjs/common';

export type UserRole = 'user'| 'employee' | 'manager' | 'admin' | 'superAdmin';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

