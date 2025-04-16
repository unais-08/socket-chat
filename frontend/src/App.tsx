import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import useAuthStore from "./store/useAuthStore";

import {
  HomePage,
  Layout,
  LoginPage,
  ProfilePage,
  ProtectedRoute,
  PublicRoute,
  SettingPage,
  SignupPage,
} from "./pages";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/signup",
          element: (
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          ),
        },
        {
          path: "/settings",
          element: <SettingPage />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
