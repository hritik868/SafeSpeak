import React, { useEffect, useState } from "react";
import getLocation from "../utils/fetchLocation";
import axios from "axios";
import "./reportingForm.css"; // Assuming you have a CSS file for styles

const ReportingForm = () => {
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState({});
  const [isReporting, setIsReporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState(""); // New state for description

  useEffect(() => {
    async function fetch() {
      const locationData = await getLocation();
      setLocation(locationData);
      console.log("Fetched");
    }
    fetch();

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.filePreview));
    };
  }, []);

  const handleFileChange = (e) => {
    const allFiles = Array.from(e.target.files);
    const tempArr = allFiles.map((file) => ({
      fileObj: file,
      fileName: file.name,
      fileType: file.type,
      filePreview: URL.createObjectURL(file),
    }));

    setFiles(tempArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsReporting(true);
    setErrorMessage("");

    try {
      const uploadedImageUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file.fileObj);
          formData.append("upload_preset", "SafeSpeak");
          formData.append("cloud_name", "dfylu3ufc");

          const uploadOptions = {
            url: file.fileType.startsWith("video")
              ? "https://api.cloudinary.com/v1_1/dfylu3ufc/video/upload"
              : "https://api.cloudinary.com/v1_1/dfylu3ufc/image/upload",
            method: "POST",
            data: formData,
          };

          const cloudRes = await axios(uploadOptions);
          return cloudRes.data.secure_url;
        })
      );

      const url = `${
        import.meta.env.VITE_SERVER_URL
      }/api/location/reportAnonymous`;
      const response = await axios.post(url, {
        filesArray: uploadedImageUrls,
        latitude: location.latitude,
        longitude: location.longitude,
        description, // Include the description in the request
      });

      alert(response.data.Message);
      setFiles([]);
      setDescription(""); // Clear the description after submission
    } catch (err) {
      setErrorMessage(err.response?.data?.Message || "An error occurred.");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="reporting-form">
      <h2>Report an Incident</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="incident-files">Upload Images/Videos of Incident</label>
        <input
          type="file"
          id="incident-files"
          accept="image/*,video/*"
          capture="environment"
          onChange={handleFileChange}
          required
          multiple
        />
        {files.length > 0 && (
          <div className="file-previews">
            {files.map((file, index) =>
              file.fileType.startsWith("image") ? (
                <img
                  key={index}
                  src={file.filePreview}
                  alt={file.fileName}
                  className="file-preview"
                />
              ) : file.fileType.startsWith("video") ? (
                <video
                  key={index}
                  src={file.filePreview}
                  controls
                  className="file-preview"
                />
              ) : null
            )}
          </div>
        )}

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          placeholder="Add a description of the incident..."
          required
        />

        <button type="submit" disabled={isReporting}>
          {isReporting ? "Reporting..." : "Submit"}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ReportingForm;
