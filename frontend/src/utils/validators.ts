export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateName = (name: string) => {
  return name.trim().length > 0;
};
