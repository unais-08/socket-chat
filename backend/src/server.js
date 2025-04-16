import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import connectDB from "./lib/connectDB.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//setup cors
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: true,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

//server configuration
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  connectDB();
});
