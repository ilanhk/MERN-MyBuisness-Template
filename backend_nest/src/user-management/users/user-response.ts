import { UserDocument } from './user.schema';

export function toProfileResponse(user: UserDocument) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user.fullName,
    email: user.email,
    isEmployee: user.isEmployee,
    inEmailList: user.inEmailList,
    twoFaSecret: user.twoFaSecret,
  };
}

export function toAdminResponse(user: UserDocument) {
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
  };
}
