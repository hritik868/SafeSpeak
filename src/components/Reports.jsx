import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import "./reports.css";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/location/getAllReports`
        );
        setReports(response.data.reports); // Adjust based on your API response structure
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
  if (!reports || !Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="no-reports-message">
        <h3>No Reports Available</h3>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <h2>All Reports</h2>
      <ul>
        {reports.map((report, index) => (
          <li key={index} className="report-item">
            <h3>Description: {report.description}</h3>
            {report.location?.latitude && report.location?.longitude && (
              <MapContainer
                center={[report.location.latitude, report.location.longitude]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[report.location.latitude, report.location.longitude]}>
                  <Popup>
                    {report.description}
                  </Popup>
                </Marker>
              </MapContainer>
            )}
            <div className="report-files">
              {report.filesArray.map((fileUrl, idx) =>
                fileUrl.endsWith(".mp4") ? (
                  <video key={idx} src={fileUrl} controls className="report-video" />
                ) : (
                  <img key={idx} src={fileUrl} alt={`Report file ${idx}`} className="report-image" />
                )
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsPage;
