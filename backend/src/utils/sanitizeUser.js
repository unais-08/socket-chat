// utils/sanitizeUser.js
const sanitizeUser = (user) => {
  const { password, ...rest } = user.toObject();
  return rest;
};

export default sanitizeUser;
