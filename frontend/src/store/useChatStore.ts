import { create } from "zustand";

import axios from "../lib/axios";
import toast from "react-hot-toast";
import useAuthStore from "./useAuthStore";
import { ChatStore } from "../types/auth.types";

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axios.get("/message/users");
      // console.log(response.data.data);
      set({ users: response.data.data });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axios.get(`/message/${userId}`);

      set({ messages: response.data.data });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axios.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
