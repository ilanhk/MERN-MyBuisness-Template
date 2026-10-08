import { AppUser } from './user.entity';

export function toProfileResponse(user: AppUser) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    departmentId: user.departmentId,
    inEmailList: user.inEmailList,
    isActive: user.isActive,
    twoFactorEnabled: Boolean(user.twoFaSecret),
  };
}

export function toAdminResponse(user: AppUser) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    departmentId: user.departmentId,
    inEmailList: user.inEmailList,
    isActive: user.isActive,
    twoFactorEnabled: Boolean(user.twoFaSecret),
  };
}
