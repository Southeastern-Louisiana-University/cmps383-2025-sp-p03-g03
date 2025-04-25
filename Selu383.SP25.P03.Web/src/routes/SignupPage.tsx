import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import LDTheatreLogo from "../assets/lionsdencinemas.svg";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserId, setRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");

    try {
      const createResponse = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          roles: ["User"],
        }),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(
          `Failed to create user: ${createResponse.status} ${errorText}`
        );
      }

      await createResponse.json();

      const loginResponse = await fetch("/api/authentication/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        throw new Error("Auto-login failed");
      }

      const loginData = await loginResponse.json();
      const roles = loginData.roles
        ? Array.isArray(loginData.roles)
          ? loginData.roles
          : [loginData.roles]
        : null;
      setUserId(loginData.id.toString());
      setRole(roles);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message.includes("409")
            ? "Username already exists"
            : error.message
          : "An error occurred during signup"
      );
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg shadow-indigo-950/50 p-8 flex-1 flex flex-col justify-center">
        <div className="flex justify-center mb-8">
          <img
            src={LDTheatreLogo}
            className="h-24 w-24 transition-transform hover:scale-110 cursor-pointer"
            alt="Theater logo"
          />
        </div>

        <h2 className="text-3xl font-extrabold text-center text-indigo-300 mb-6 drop-shadow-lg">
          Sign Up
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-900 border border-red-800 text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
            >
              Log in here
            </button>
          </p>
        </div>
      </div>

      <footer className="w-full bg-indigo-950 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {currentYear} Lion's Den Cinemas. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/terms" className="hover:text-indigo-300">
              Terms
            </a>
            <a href="/privacy" className="hover:text-indigo-300">
              Privacy
            </a>
            <a href="/contact" className="hover:text-indigo-300">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignupPage;
