import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import LDTheatreLogo from "../assets/lionsdencinemas.svg";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId, setRole } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill out all fields");
    } else {
      setError("");
      const loginUrl = "/api/authentication/login";

      fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();
          setUserId(data.id.toString());
          setRole(data.roles);
          setIsAuthenticated(true);
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          setError("Invalid username or password");
        });
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl shadow-indigo-900/50 p-8">
        <div className="flex justify-center mb-8">
          <img
            src={LDTheatreLogo}
            className="h-24 w-24 transition-transform hover:scale-110 cursor-pointer"
            alt="Theater logo"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600! hover:bg-indigo-700! text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow hover:shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
