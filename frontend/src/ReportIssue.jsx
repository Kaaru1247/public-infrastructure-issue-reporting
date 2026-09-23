import React, { useState } from "react";
import "./ReportIssue.css";

function ReportIssue({ onBack }) {
  const [issueType, setIssueType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!issueType || !location || !description) {
    alert("Please fill all the details");
    return;
  }

  try {
    const response = await fetch(
      "https://public-infrastructure-issue-reporting.onrender.com/locations?latitude=11.0168&longitude=76.9558&address=" +
        encodeURIComponent(location),
      {
        method: "POST",
      }
    );

    const locationData = await response.json();

    if (!response.ok) {
      alert(locationData.detail || "Location failed");
      return;
    }

    const userId = localStorage.getItem("user_id");

    const complaintResponse = await fetch(
      "https://public-infrastructure-issue-reporting.onrender.com/complaints?user_id=" +
        userId +
        "&location_id=" +
        locationData.location_id +
        "&title=" +
        encodeURIComponent(issueType) +
        "&description=" +
        encodeURIComponent(description),
      {
        method: "POST",
      }
    );

    const complaintData = await complaintResponse.json();
    if (selectedFile) {
  const formData = new FormData();
  formData.append("file", selectedFile);

  const imageResponse = await fetch(
    "https://public-infrastructure-issue-reporting.onrender.com/complaints/" +
      complaintData.complaint_id +
      "/images",
    {
      method: "POST",
      body: formData,
    }
  );

  const imageData = await imageResponse.json();

  if (!imageResponse.ok) {
    alert(imageData.detail || "Image upload failed");
    return;
  }
}


    if (!complaintResponse.ok) {
      alert(complaintData.detail || "Complaint failed");
      return;
    }

    alert("Issue reported successfully!");
  } catch (error) {
    console.error(error);
    alert("Cannot connect to backend");
  }
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

          <input
  type="file"
  accept="image/*"
  onChange={(e) => setSelectedFile(e.target.files[0])}
/>

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