import React, { useState } from "react";
import getLocation from "../utils/fetchLocation";
import axios from "axios";

const ReportingForm = () => {
  const [files, setFiles] = useState([]);
  const [location, setLocation] = useState({});
  const [isReporting, setIsReporting] = useState(false);

  const handleFileChange = (e) => {
    const allFiles = Array.from(e.target.files);
    const tempArr = allFiles.map((file) => {
      return {
        fileObj: file,
        fileName: file.name,
        filePreview: URL.createObjectURL(file),
      };
    });

    setFiles(tempArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsReporting(true);
    const locationData = await getLocation();
    setLocation(locationData);

    const uploadedImageUrls = [];

    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file.fileObj);
      formData.append("upload_preset", "SafeSpeak");
      formData.append("cloud_name", "dfylu3ufc");

      try {
        const cloudRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dfylu3ufc/image/upload",
          formData
        );
        uploadedImageUrls.push(cloudRes.data.secure_url);
      } catch (err) {
        alert("error while reporting");
        setIsReporting(false);
        setFiles([]);
      }
    });
    await Promise.all(uploadPromises);

    const url = `${
      import.meta.env.VITE_SERVER_URL
    }/api/location/reportAnonymous`;

    try {
      const response = await axios.post(url, {
        filesArray: uploadedImageUrls,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });
      console.log(response);
      setIsReporting(false);
      alert(response.data.Message);
      setFiles([]);
    } catch (err) {
      alert(err.response.data.Message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="incident-files">
          Upload Images/Videos Of Incidents
        </label>
        <input
          type="file"
          id="incident-files"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          required
          multiple
        ></input>
        {files.length > 0 && (
          <div>
            {files.map((file, index) => (
              <img
                key={index}
                src={file.filePreview}
                alt={file.fileName}
                width="40"
                height="40"
              ></img>
            ))}
          </div>
        )}
        <button type="submit">submit</button>

        {isReporting && <p>Reportingg.......</p>}
      </form>
    </div>
  );
};

export default ReportingForm;
