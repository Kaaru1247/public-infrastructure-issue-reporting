import React, { useState } from "react";

function Register({ onBack, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all the details");
      return;
    }

    try {
      const response = await fetch(
        `https://public-infrastructure-issue-reporting.onrender.com/register?name=${encodeURIComponent(
          name
        )}&email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(
          password
        )}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Registration failed");
        return;
      }

      alert("Account created successfully!");

      if (onRegistered) {
        onRegistered();
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Create Account</h1>

        <p className="subtitle">
          Create your Public Infrastructure account
        </p>

        <form onSubmit={handleRegister}>

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <button
            type="submit"
            className="login-btn"
          >
            Create Account
          </button>

        </form>

        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}
export default Register;