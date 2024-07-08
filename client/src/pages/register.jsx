import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const { register } = useAuth();

  // Handle user registration
  const handleRegister = async () =>
    await register({
      username,
      password,
      email,
    });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 ">
      <form
        className=" md:p-8 p-4 max-w-screen-sm w-full py-8 rounded-lg shadow-md border-2 border-[#3baea0]"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleRegister();
        }}
      >
        <h1 className="md:text-3xl text-2xl font-bold mb-6 text-center">
          Sign up
        </h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800  py-3 px-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3baea0c0]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800  py-3 px-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3baea0c0]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800  py-3 px-4 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#3baea0bb]"
        />
        <button className="w-full py-2 bg-[#2e8f83] text-white rounded hover:bg-[#34a394]">
          Login
        </button>
        <div className="text-sm mt-4 text-center text-white">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400  hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default register;
