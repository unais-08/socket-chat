import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { CustomError } from "../utils/CustomError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// @desc    Middleware to protect routes by verifying JWT token

export const protectRoute = asyncHandler(async (req, res, next) => {
  // Extract token from cookie or Authorization header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  // If no token is provided, block access
  if (!token) {
    throw new CustomError("Authentication token not found", 401); // Unauthorized
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new CustomError("Not authorized or token expired", 401); // Covers invalid or expired tokens
  }

  // Fetch user from DB and exclude password field
  const user = await User.findById(decoded.userId).select("-password  -__v");

  // If user not found in DB (e.g., deleted account)
  if (!user) {
    throw new CustomError("User not found", 404); // Not Found
  }

  // Attach the user to the request object for use in next middleware/controller
  req.user = user;

  next(); // Proceed to the next middleware/controller
});
