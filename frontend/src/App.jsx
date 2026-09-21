import { useState } from "react";
import Login from "./Login";
import ReportIssue from "./ReportIssue";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");

  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!verifyEmail || !verifyPassword) {
      setVerifyError("Please enter email and password");
      return;
    }

    setLoading(true);
    setVerifyError("");

    try {
      const response = await fetch(
        `https://public-infrastructure-issue-reporting.onrender.com/login?email=${encodeURIComponent(
          verifyEmail
        )}&password=${encodeURIComponent(verifyPassword)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setVerifyError(
          data.detail || "Invalid email or password"
        );
        setLoading(false);
        return;
      }

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
      localStorage.setItem(
        "user_email",
        verifyEmail
      );

      setPage("report");

    } catch (error) {
      console.error(error);

      setVerifyError(
        "Cannot connect to backend. Please make sure FastAPI server is running."
      );
    }

    setLoading(false);
  };

  // LOGIN PAGE
  if (page === "login") {
    return (
      <Login
        onLogin={() => setPage("home")}
        onBack={() => setPage("home")}
      />
    );
  }

  // VERIFICATION PAGE
  if (page === "verify") {
    return (
      <div className="verify-page">
        <div className="verify-card">

          <h1>Verify Before Reporting</h1>

          <p>
            Please verify your account before reporting
            an infrastructure issue.
          </p>

          <form onSubmit={handleVerify}>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={verifyEmail}
              onChange={(e) => {
                setVerifyEmail(e.target.value);
                setVerifyError("");
              }}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={verifyPassword}
              onChange={(e) => {
                setVerifyPassword(e.target.value);
                setVerifyError("");
              }}
            />

            {verifyError && (
              <p className="verify-error">
                {verifyError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & Continue"}
            </button>

          </form>

          <button
            type="button"
            onClick={() => setPage("home")}
          >
            Back
          </button>

        </div>
      </div>
    );
  }

  // REPORT PAGE
  if (page === "report") {
    return (
      <ReportIssue
        onBack={() => setPage("home")}
      />
    );
  }

  // HOME PAGE
  return (
    <div className="app">

      <section className="hero">

        <h1>
          Public Infrastructure Issue Reporting
        </h1>

        <p>
          Report public infrastructure problems quickly
          and easily.
        </p>

        <button onClick={() => setPage("login")}>
          Login
        </button>

        <button onClick={() => setPage("verify")}>
          Report an Issue
        </button>

        <button onClick={() => setPage("view")}>
          View Issues
        </button>

      </section>

    </div>
  );
}

export default App;