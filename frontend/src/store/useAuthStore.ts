import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

import axios from "../lib/axios";
import { AuthStore, LoginFormData, SignUpFormData } from "../types/auth.types";

// const BACKEND_BASE_URL = "http://localhost:8080";
const BACKEND_BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8080" : "/";

const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  //functions

  //checking auth
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get("/auth/check");
      set({ authUser: response.data.data });
      get().connectSocket(); // Connect to socket after successful auth check
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Sign up function
  signup: async (userData: SignUpFormData) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/auth/signup", userData);

      set({ authUser: response.data.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "An unknown error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  //login function
  login: async (userData: LoginFormData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post("/auth/login", userData);

      set({ authUser: response.data.data });
      toast.success(response.data.message);
      get().connectSocket(); // Connect to socket after successful login
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          (error as any).response?.data?.message || "An unknown error occurred"
        );
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
      get().disconnectSocket(); // Disconnect socket on logout
    } catch (error: any) {
      toast.error(error.response.data.message || "Logout failed");
    }
  },
  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/auth/update-profile", data);
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("error in update profile:", error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BACKEND_BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected ?? false) get().socket?.disconnect();
  },
}));

export default useAuthStore;
