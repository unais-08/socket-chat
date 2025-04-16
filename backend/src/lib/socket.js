import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
// used to store online users
const userSocketMap = {}; // {userId: socketId}
io.on("connection", (socket) => {
  // console.log("New client connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id; // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    // console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
