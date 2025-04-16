import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth endpoints
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); // Logout user and clear token

// Update user profile (protected route)
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth); // Check if user is authenticated

export default router;
