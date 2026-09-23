import { useEffect, useState } from "react";

function ViewIssues({ onBack }) {
  const [issues, setIssues] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    "https://public-infrastructure-issue-reporting.onrender.com";

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const response = await fetch(`${API_URL}/complaints`);

        if (!response.ok) {
          throw new Error("Failed to load issues");
        }

        const data = await response.json();

        setIssues(data);

        const imageData = {};

        for (const issue of data) {
          try {
            const imageResponse = await fetch(
              `${API_URL}/complaints/${issue.complaint_id}/images`
            );

            if (imageResponse.ok) {
              const result = await imageResponse.json();

              imageData[issue.complaint_id] = result;
            }
          } catch (error) {
            console.log("Image loading error:", error);
          }
        }

        setImages(imageData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Unable to load issues");
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  return (
    <div className="view-issues-page">
      <div className="view-issues-box">

        <h1>Reported Issues</h1>

        <p>
          View reported public infrastructure issues
        </p>

        {loading && (
          <p>Loading issues...</p>
        )}

        {error && (
          <p>{error}</p>
        )}

        {!loading &&
          !error &&
          issues.length === 0 && (
            <p>No issues reported yet.</p>
          )}

        {!loading &&
          !error &&
          issues.map((issue) => (
            <div
              key={issue.complaint_id}
              className="issue-card"
            >

              <h2>{issue.title}</h2>

              <p>
                <strong>Description:</strong>{" "}
                {issue.description}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {issue.status}
              </p>

              <p>
                <strong>Issue ID:</strong>{" "}
                {issue.complaint_id}
              </p>

              <div className="issue-images">

                <h3>Uploaded Photo</h3>

                {images[issue.complaint_id] &&
                images[issue.complaint_id].length > 0 ? (

                  images[issue.complaint_id].map(
                    (image) => {

                      const imagePath =
                        image.image_path
                          .replace(/\\/g, "/")
                          .replace(/^uploads\//, "");

                      return (
                        <img
                          key={image.image_id}
                          src={`${API_URL}/uploads/${imagePath}`}
                          alt="Reported infrastructure issue"
                          style={{
                            width: "300px",
                            maxWidth: "100%",
                            height: "auto",
                            borderRadius: "10px",
                            marginTop: "10px",
                            display: "block"
                          }}
                        />
                      );
                    }
                  )

                ) : (

                  <p>No photo uploaded.</p>

                )}

              </div>

            </div>
          ))}

        <button
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default ViewIssues;