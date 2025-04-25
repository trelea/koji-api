export const generateOTP = (len: number = 6): string => {
  const digits: string = '0123456789';
  let otp: string = '';
  for (let i = 0; i < len; i++) otp += digits[Math.floor(Math.random() * 10)];
  return otp;
};
