import { Outlet } from "react-router";

import Navbar from "../components/Navbar";
import { useThemeStore } from "../store/useThemeStore";

const Layout = () => {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme}>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
