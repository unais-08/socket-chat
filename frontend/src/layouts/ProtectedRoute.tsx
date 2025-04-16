import { JSX } from "react";
import { Navigate } from "react-router";

import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const authUser = useAuthStore((state) => state.authUser);
  return authUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
