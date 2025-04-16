import { JSX } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const authUser = useAuthStore((state) => state.authUser);
  return !authUser ? children : <Navigate to="/" />;
};

export default PublicRoute;
