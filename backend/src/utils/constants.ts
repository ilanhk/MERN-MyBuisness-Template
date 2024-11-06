export const verifyPassword = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password); // Checks for at least one uppercase letter
  const hasLowercase = /[a-z]/.test(password); // Checks for at least one lowercase letter
  const hasNumber = /\d/.test(password); // Checks for at least one number - any digit (0-9)
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/.test(password); // Checks for special characters

  if (!password || password.length < 12 || !hasUppercase || !hasLowercase || !hasNumber || !specialCharPattern){
    return false;
  } else {
    return true;
  };
};

