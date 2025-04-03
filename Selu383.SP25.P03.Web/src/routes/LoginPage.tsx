import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

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
          console.log(data);
          setUserId(data.id.toString());
          setRole(data.roles);
          setIsAuthenticated(true);
          navigate("/");
        })
        .catch((error) => {
          console.error(error);
          setError("Error logging in");
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
