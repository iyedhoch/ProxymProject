import React, { useState } from "react";
import "./UploadPDF.css";

function UploadPDF() {
  const [file, setFile] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8002/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);
      } else {
        const error = await response.text();
        alert("Upload failed: " + error);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      alert("Error uploading file");
    }
  };

  return (
    <div className="upload-container">
      <div
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & Drop a PDF file here or click to select</p>
        )}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
        />
      </div>
      <button onClick={handleUpload}>Upload PDF</button>
    </div>
  );
}

export default UploadPDF;
