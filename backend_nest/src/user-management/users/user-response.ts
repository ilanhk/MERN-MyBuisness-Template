import { AppUser } from './user.entity';

export function toProfileResponse(user: AppUser) {
  return {
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    isEmployee: user.isEmployee,
    inEmailList: user.inEmailList,
    twoFaSecret: user.twoFaSecret,
  };
}

export function toAdminResponse(user: AppUser) {
  return {
    _id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    isEmployee: user.isEmployee,
    isAdmin: user.isAdmin,
    isSuperAdmin: user.isSuperAdmin,
    inEmailList: user.inEmailList,
  };
}
