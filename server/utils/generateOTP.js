const generateOTP = () => {
  // Generate a random 6-digit number string
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export default generateOTP;
