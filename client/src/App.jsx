import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/login";
import Register from "./pages/register";
import Blogs from "./pages/blogs";
import AddBlog from "./pages/addBlog";
import Blog from "./pages/blog";
import Layout from "./Layout";

function App() {
  return (
    <Routes>
      {/* Wrap all routes with Layout */}
      <Route path="/" element={<Layout />}>
        {/* Private routes */}
        <Route
          index={true}
          path="/"
          element={
            <div className="w-full h-screen flex items-center justify-center">
              <Link
                className="text-[#3cbcb1] text-lg hover:underline"
                to="/blogs"
              >
                Go to Blogs Section | Not Design yet
              </Link>
            </div>
          }
        />

        <Route
          path="blogs"
          element={
            <PrivateRoute>
              <Blogs />
            </PrivateRoute>
          }
        />
        <Route
          path="create-blog"
          element={
            <PrivateRoute>
              <AddBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="blog"
          element={
            <PrivateRoute>
              <Blog />
            </PrivateRoute>
          }
        />

        {/* Public routes */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* 404 page */}
        <Route
          path="*"
          element={
            <div className="w-full h-screen flex items-center justify-center">
              <h1 className="text-lg">404 Page not found | Not Design yet</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
