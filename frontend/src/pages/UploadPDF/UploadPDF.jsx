import React, { useState } from "react";
import "./UploadPDF.css";

function UploadPDF() {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [internshipDays, setInternshipDays] = useState("");
  const [numStudents, setNumStudents] = useState("");

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

    if (!internshipDays || !numStudents) {
      alert("Please enter internship days and number of students.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("internshipDays", internshipDays);
    formData.append("numStudents", numStudents);

    try {
      const response = await fetch("http://localhost:8002/api/upload/pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        alert(result);

        setUploadedFiles((prev) => [
          {
            name: file.name,
            size: file.size,
            date: new Date(),
            internshipDays,
            numStudents,
          },
          ...prev,
        ]);
        setFile(null);
        setInternshipDays("");
        setNumStudents("");
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
      

      {/* New Inputs */}
      <div className="input-group">
        <label>Number of Internship Days:</label>
        <input
          type="number"
          min="1"
          value={internshipDays}
          onChange={(e) => setInternshipDays(e.target.value)}
          placeholder="Enter days"
        />
      </div>

      <div className="input-group">
        <label>Number of Students:</label>
        <input
          type="number"
          min="1"
          value={numStudents}
          onChange={(e) => setNumStudents(e.target.value)}
          placeholder="Enter number of students"
        />
      </div>

      {/* Drag & Drop */}
      <div
        className={`drop-zone ${file ? "has-file" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? (
          <p className="file-name">{file.name}</p>
        ) : (
          <p>Drag & Drop a PDF file here or click to select</p>
        )}
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
        />
      </div>

      <button onClick={handleUpload} disabled={!file}>
        Upload PDF
      </button>

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h2>Uploaded Files</h2>
          <div className="files-grid">
            {uploadedFiles.map((f, index) => (
              <div key={index} className="file-card">
                <p className="file-name">{f.name}</p>
                <p>{(f.size / 1024).toFixed(2)} KB</p>
                <p>Date: {f.date.toLocaleString()}</p>
                <p>Internship Days: {f.internshipDays}</p>
                <p>Number of Students: {f.numStudents}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPDF;
