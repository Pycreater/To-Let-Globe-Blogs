import logo from "../assets/tolet.png";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="top py-3 px-5">
      <div className="topLeft">
        <NavLink to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="w-[100px]" />
        </NavLink>
      </div>
      <div className="topRight">
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
          to="/service"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Service
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          About
        </NavLink>
      </div>
    </div>
  );
}
