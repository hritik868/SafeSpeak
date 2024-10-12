import React, { useEffect, useState } from "react";
import axios from "axios";
import "./reports.css"; 

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`);
        setReports(response.data); // Adjust based on your API response structure
      } catch (err) {
        setError(err.response?.data?.Message || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="reports-page">
      <h2>All Reports</h2>
      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <ul>
          {reports.map((report, index) => (
            <li key={index} className="report-item">
              <h3>Description: {report.description}</h3>
              <p>Location: {report.latitude}, {report.longitude}</p>
              <div className="report-files">
                {report.filesArray.map((fileUrl, idx) => (
                  fileUrl.endsWith('.mp4') ? (
                    <video key={idx} src={fileUrl} controls className="report-video" />
                  ) : (
                    <img key={idx} src={fileUrl} alt={`Report file ${idx}`} className="report-image" />
                  )
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportsPage;
