import { useEffect, useState } from "react";
import logo from "../assets/tolet.png";
import { NavLink, useNavigate } from "react-router-dom";
import { LocalStorage } from "../util/index.js";
import { useAuth } from "../context/auth.context.jsx";

export default function NavBar() {
  const [isLoggedIn, SetIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { logout, token, user } = useAuth();

  const authHandler = () => {
    if (!isLoggedIn) navigate("/login");
    else logout();
  };

  useEffect(() => {
    SetIsLoggedIn(token && user ? true : false);
  }, [isLoggedIn, SetIsLoggedIn, authHandler]);

  return (
    <div className="top py-3 px-5">
      <div className="topLeft">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="w-[100px]" />
        </NavLink>
      </div>
      <div className="topRight md:flex hidden">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Blogs
        </NavLink>
        <NavLink
          to="/my-blogs"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          My Blogs
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          About
        </NavLink>
        <button
          className=" py-2 px-5 bg-[#2e8f83] text-base text-white rounded hover:bg-[#34a394]"
          onClick={authHandler}
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
}
