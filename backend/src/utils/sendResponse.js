// utils/sendResponse.js
export const sendResponse = (res, message, data = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data, // Only include if not null
  });
};
