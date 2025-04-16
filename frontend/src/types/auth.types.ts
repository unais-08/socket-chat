import { io } from "socket.io-client";

export interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AutoImagePatternProps {
  title: string;
  subtitle: string;
}

export interface AuthStore {
  socket?: ReturnType<typeof io>;
  authUser: any | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[] | any[];
  signup: (userData: SignUpFormData) => Promise<void>;
  login: (userData: LoginFormData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: FormData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export interface ChatStore {
  users: any[];
  messages: any[];
  selectedUser: any | null;
  isMessageLoading: boolean;
  isUsersLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser(selectedUser: any): void;
  sendMessage: (messageData: any) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
