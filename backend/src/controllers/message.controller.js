import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/CustomError.js";
import { sendResponse } from "../utils/sendResponse.js";

// @desc    Fetch all users excluding the currently logged-in user (for sidebar display)
// @route   GET /api/message/users
// @access  Private
export const getUserForSidebar = asyncHandler(async (req, res) => {
  const loggedUserId = req.user._id;

  // Fetch users except the logged-in user, exclude sensitive/meta fields
  const users = await User.find({ _id: { $ne: loggedUserId } }).select(
    "-password -__v -createdAt -updatedAt"
  );

  // if (!users || users.length === 0) {
  //   // If no users found, throw a custom error
  //   throw new CustomError("No users found", 404); // Not Found
  // }

  sendResponse(res, "Users fetched successfully", users, 200);
});

// @desc    Get all messages exchanged between logged-in user and another user.
// @route   GET /api/message/:id
// @access  Private

export const getMessages = asyncHandler(async (req, res) => {
  // Extract the user ID from route parameters (e.g., /api/message/:id)
  const { id: userIdToChat } = req.params;

  // Log the userId for debugging purposes
  // console.log(userIdToChat);

  // Get the currently logged-in user's ID from the request object
  const loggedUserId = req.user._id;

  // Validate that a user ID is provided in the request
  if (!userIdToChat) {
    throw new CustomError("User ID is required", 400); // Bad Request
  }

  // Query the database for messages exchanged between the two users
  const messages = await Message.find({
    $or: [
      { senderId: loggedUserId, recieverId: userIdToChat },
      { senderId: userIdToChat, recieverId: loggedUserId },
    ],
  }).select("-password -__v -updatedAt"); // Populate sender and receiver user data excluding sensitive fields

  // If no messages are found, return a 404 error
  // if (!messages) {
  //   throw new CustomError("No messages found", 404); // Not Found
  // }

  // Send a successful response with the fetched messages
  sendResponse(res, "Messages fetched successfully", messages, 200);
});

// @desc    Send a message (text and/or image) from the logged-in user to another user
// @route   POST /api/message/send/:id
// @access  Private

export const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;

  const { id: recieverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    // Upload image to Cloudinary and store the secure URL
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }
  // console.log(imageUrl);
  // Create and save the new message document
  const newMessage = new Message({
    senderId,
    recieverId,
    text,
    image: imageUrl,
  });

  await newMessage.save();
  const receiverSocketId = getReceiverSocketId(recieverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  sendResponse(res, "Message sent successfully", newMessage, 201);
});
