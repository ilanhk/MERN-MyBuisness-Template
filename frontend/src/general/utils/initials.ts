export const UpperCaseInitials = (name: string) =>{
  const initials = name.split(' ')
  .map(word => word[0].toUpperCase())
  .join('');

  return initials;
}