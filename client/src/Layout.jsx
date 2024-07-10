import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/Navbar";

const Layout = () => {
  const [isSecure, setIsSecure] = useState(false);

  useEffect(() => {
    if (
      window.location.pathname == "/login" ||
      window.location.pathname == "/register"
    ) {
      setIsSecure(true);
    }
  });
  return (
    <div className="w-full">
      {!isSecure && <NavBar />}
      <Outlet />
    </div>
  );
};

export default Layout;
