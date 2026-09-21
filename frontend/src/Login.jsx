import React, { useState } from "react";
import "./Login.css";

function Login({ onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        `https://public-infrastructure-issue-reporting.onrender.com/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          typeof data.detail === "string"
            ? data.detail
            : "Login failed"
        );
        return;
      }

      // Save login information
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "user_id",
        data.user_id
      );

      localStorage.setItem(
        "user_name",
        data.name
      );

      localStorage.setItem(
        "user_role",
        data.role
      );

      alert("Login successful!");

    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend. Please make sure FastAPI server is running."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Login to your Public Infrastructure account
        </p>

        <form onSubmit={handleLogin}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <button
              type="button"
              className="forgot"
            >
              Forgot Password?
            </button>

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        <div className="or">
          <span></span>
          OR
          <span></span>
        </div>

        <p className="create-account">
          Don't have an account?
          <button type="button">
            Create Account
          </button>
        </p>

        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          Back
        </button>

      </div>
    </div>
  );
}

export default Login;