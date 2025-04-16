import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { sendResponse } from "../utils/sendResponse.js";
import sanitizeUser from "../utils/sanitizeUser.js";
import { generateToken } from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate required fields
  if (!fullName || !email || !password) {
    throw new CustomError("Please provide all required fields", 400);
  }

  // Validate password length
  if (password.length < 6) {
    throw new CustomError("Password must be at least 6 characters long", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomError("User already exists", 409);
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user instance
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  // Generate and set JWT token in cookie
  generateToken(newUser._id, res);

  // Save user to the database
  await newUser.save();

  // Send success response without password
  sendResponse(res, "User created successfully", sanitizeUser(newUser), 201);
});

// @desc    Authenticate user and start a session
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Ensure both fields are provided
  if (!email || !password) {
    throw new CustomError("Email and password are required", 400); // Bad Request
  }

  // Look up the user by email
  const user = await User.findOne({ email });

  // Prevent leaking info about which credential is incorrect
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid email or password", 403); // Forbidden for invalid login attempt
  }

  // Generate and set JWT in cookie
  generateToken(user._id, res);

  // Return user data excluding password
  sendResponse(res, "Login successful", sanitizeUser(user), 200); // OK
});

// @desc    Logout user and clear auth token
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  sendResponse(res, "Logged out successfully", null, 200);
});

//@desc Update user profile picture
//@route PUT /api/auth/update-profile
//@access Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;

  if (!profilePic) {
    throw new CustomError("Please provide a profile picture", 400);
  }

  // Upload using the temp file path
  const uploadResponse = await cloudinary.uploader.upload(profilePic);
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { profilePic: uploadResponse.secure_url },
    { new: true }
  );
  if (!updatedUser) {
    throw new CustomError("Error in update profile", 500);
  }
  sendResponse(res, "Image uploaded successfully", updatedUser, 200);
});

//@desc Check if user is authenticated
//@route GET /api/auth/check
//@access Private
export const checkAuth = asyncHandler(async (req, res) => {
  const user = req.user; // User is already populated by the middleware

  if (!user) {
    throw new CustomError("User is not authenticated", 404);
  }

  sendResponse(res, "User is authenticated", sanitizeUser(user), 200);
});

export const deleteAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users.length === 0) {
    throw new CustomError("No users found", 404);
  }

  await User.deleteMany({});

  sendResponse(res, "All users deleted successfully", null, 200);
});
