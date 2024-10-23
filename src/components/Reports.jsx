import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

// Custom marker icon setup
const customMarkerIcon = L.icon({
  iconUrl: 'https://cdn-icons-mp4.flaticon.com/512/11201/11201834.mp4', // Replace with your icon's path
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -34],
});

const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-6 bg-blue-300 rounded mb-4"></div>
    <div className="h-4 bg-blue-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-blue-300 rounded w-1/2"></div>
    <div className="mt-4 h-64 bg-blue-200 rounded"></div>
  </div>
);

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
        setReports(response.data.reports); 
      } catch (err) {
        setError(err.response?.data?.Message || "Failed to fetch reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const toggleResolvedStatus = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, resolved: !report.resolved } : report
      )
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-blue-800">Loading Reports...</h2>
        <div className="grid gap-6">
          {[...Array(3)].map((_, idx) => (
            <SkeletonLoader key={idx} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-bold py-4">
        <h3>{error}</h3>
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="text-center text-gray-700 py-10">
        <h3 className="text-2xl font-semibold text-blue-800">No Reports Available</h3>
        <p className="text-gray-500 mt-2">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">All Reports</h2>
      <ul className="space-y-8">
        {reports.map((report, index) => (
          <li
            key={index}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="flex flex-col justify-between">
                <h3 className="text-xl font-semibold mb-2 text-blue-900">
                  Description: {report.description}
                </h3>
                {/* Resolved Status Button */}
                <div className="mt-4">
                  <button
                    onClick={() => toggleResolvedStatus(report.id)}
                    className={`py-2 px-4 rounded-lg font-semibold ${
                      report.resolved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {report.resolved ? 'Mark as Not Resolved' : 'Mark as Resolved'}
                  </button>
                </div>
              </div>

              {/* Location Map */}
              <div>
                {report.location?.latitude && report.location?.longitude ? (
                  <MapContainer
                    center={[report.location.latitude, report.location.longitude]}
                    zoom={13}
                    style={{ height: "300px", width: "100%", borderRadius: "8px" }}
                    className="overflow-hidden shadow-sm"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[report.location.latitude, report.location.longitude]} icon={customMarkerIcon}>
                      <Popup>{report.description}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-64 bg-blue-200 rounded animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Report Files (images/videos) */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {report.filesArray.map((fileUrl, idx) =>
                fileUrl.endsWith(".mp4") ? (
                  <video
                    key={idx}
                    src={fileUrl}
                    controls
                    className="rounded-lg shadow-sm w-full h-56 object-cover"
                  />
                ) : (
                  <img
                    key={idx}
                    src={fileUrl}
                    alt={`Report file ${idx}`}
                    className="rounded-lg shadow-sm w-full h-56 object-cover"
                  />
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
