import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Accessing the login function from the AuthContext
  const { login } = useAuth();

  // Function to handle the login process
  const handleLogin = async () =>
    await login({
      email,
      password,
    });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 ">
      <form
        className=" md:p-8 p-4 max-w-screen-sm w-full py-8 rounded-lg shadow-md border-2 border-[#3baea0]"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleLogin();
        }}
      >
        <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center">
          Login
        </h1>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800  py-3 px-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3baea0b4]"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800  py-3 px-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3baea0a8]"
        />
        <button className="w-full py-2 bg-[#2e8f83] text-white rounded hover:bg-[#34a394]">
          Login
        </button>
        <div className="text-sm mt-4 text-center text-white">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400  hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
