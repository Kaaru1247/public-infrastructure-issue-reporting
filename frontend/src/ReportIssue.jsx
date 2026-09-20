import React, { useState } from "react";
import "./ReportIssue.css";

function ReportIssue({ onBack }) {
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!issueType || !location || !description) {
      alert("Please fill all the details");
      return;
    }

    alert("Issue reported successfully!");
  };

  return (
    <div className="report-container">
      <div className="report-box">

        <h1>Report an Issue</h1>

        <p>Help us improve your community</p>

        <form onSubmit={handleSubmit}>

          <label>Issue Type</label>

          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
          >
            <option value="">Select issue type</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Street Light">Street Light</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leakage">Water Leakage</option>
            <option value="Other">Other</option>
          </select>

          <label>Location</label>

          <input
            type="text"
            placeholder="Enter issue location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Description</label>

          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Upload Photo</label>

          <input type="file" accept="image/*" />

          <button type="submit" className="submit-btn">
            Submit Report
          </button>

        </form>

        {/* Back button */}
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

export default ReportIssue;