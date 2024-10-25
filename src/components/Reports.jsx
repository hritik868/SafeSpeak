import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { format } from "date-fns";

const SkeletonLoader = () => (
  <div className="animate-pulse p-6 bg-gray-100 rounded-lg shadow-md">
    <div className="h-6 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="mt-4 h-48 bg-gray-200 rounded"></div>
  </div>
);

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const fixedId = "admin";
  const fixedPassword = "admin";

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId === fixedId && password === fixedPassword) {
      setAuthenticated(true);
      setUserId("");
      setPassword("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

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
    if (authenticated) fetchReports();
  }, [authenticated]);

  const toggleResolvedStatus = (reportId) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, resolved: !report.resolved } : report
      )
    );
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen justify-center items-center bg-gray-100">
        <div className="max-w-sm w-full p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Admin Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="block w-full border rounded-md p-2 outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border rounded-md p-2 outline-none focus:ring focus:border-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Loading Reports...</h2>
        <div className="grid gap-6">
          {[...Array(3)].map((_, idx) => <SkeletonLoader key={idx} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold py-4">
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Report Dashboard</h2>
      <ul className="space-y-8">
        {reports.map((report) => (
          <li key={report._id} className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">Description</h3>
                <p className="text-gray-600 mb-2">{report.description}</p>
                <p className="font-medium text-gray-700">Category: <span className="font-normal text-gray-600">{report.category}</span></p>
                <p className="text-sm text-gray-500">Submitted on: {format(new Date(report.createdAt), "MMMM dd, yyyy 'at' hh:mm a")}</p>
                <button
                  onClick={() => toggleResolvedStatus(report._id)}
                  className={`mt-4 py-2 px-4 rounded-lg font-semibold transition ${
                    report.resolved ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
                >
                  {report.resolved ? "Mark as Not Resolved" : "Mark as Resolved"}
                </button>
              </div>
              <div>
                {report.location?.latitude && report.location?.longitude ? (
                  <MapContainer
                    center={[report.location.latitude, report.location.longitude]}
                    zoom={13}
                    style={{ height: "300px", width: "100%", borderRadius: "8px" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[report.location.latitude, report.location.longitude]}>
                      <Popup>{report.description}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="h-64 bg-gray-200 rounded"></div>
                )}
              </div>
            </div>
            {report.filesArray.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                {report.filesArray.map((fileUrl, idx) => (
                  fileUrl.endsWith(".mp4") ? (
                    <video key={idx} src={fileUrl} controls className="rounded-lg w-full" />
                  ) : (
                    <img key={idx} src={fileUrl} alt="Report file" className="rounded-lg w-full" />
                  )
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsPage;
