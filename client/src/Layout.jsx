import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./components/Navbar";

const Layout = () => {
  return (
    <div className="w-full">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
