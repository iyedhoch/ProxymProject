import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Form.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authFetch,uploadFile } from "../../utils/api";

export default function Form() {
  const TOTAL_STEPS = 3;

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Step 1 — Program Details
  const [form, setForm] = useState({
    numberOfStudents: "",
    startDate: "",
    internshipDays: "",
    internshipType: "",
  });

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsStatus, setSuggestionsStatus] = useState("idle");
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);

  const summary = useMemo(
    () => ({
      students: form.numberOfStudents ? `${form.numberOfStudents} students` : "— students",
      startDate: form.startDate || "—",
      duration: form.internshipDays ? `${form.internshipDays} days` : "— days",
      internshipType: form.internshipType || "—",
    }),
    [form]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  useEffect(() => {
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
      document.body.addEventListener(eventName, preventDefaults, false)
    );
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) =>
        document.body.removeEventListener(eventName, preventDefaults, false)
      );
    };
  }, []);

  // Fetch project recommendations when entering Step 3
  useEffect(() => {
    if (currentStep !== 3 || !uploadedFileName) return;
    fetchProjectRecommendations();
  }, [currentStep, uploadedFileName]);

  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  };

  const onInput = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // FILE UPLOAD FUNCTION (REPLACED THE DUPLICATE)
  const handleFileUpload = async (file) => {
  console.log('🔄 Starting file upload:', file.name, file.size, file.type);
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    console.log('📦 FormData created');
    
    const uploadResponse = await uploadFile('http://localhost:8002/api/upload/pdf', formData);
    console.log('📨 Response status:', uploadResponse.status);
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('❌ Server error:', errorText);
      throw new Error(errorText || `Upload failed: ${uploadResponse.status}`);
    }
    
    const result = await uploadResponse.text();
    console.log('✅ Upload success:', result);
    
    // Extract filename from response
    const fileNameMatch = result.match(/File uploaded successfully: (.+)/);
    const fileName = fileNameMatch ? fileNameMatch[1] : file.name;
    
    setUploadedFileName(fileName);
    setUploadedFile(file);
    setErrors({...errors, document: undefined});
    showMessage("File uploaded successfully!", "success");
    
  } catch (error) {
    console.error('Upload error:', error);
    showMessage(error.message || "File upload failed", "error");
    setErrors({...errors, document: error.message || "File upload failed"});
  }
};

  // PROJECT RECOMMENDATION FUNCTION
  const fetchProjectRecommendations = async () => {
  console.log('fetchProjectRecommendations called');
  if (!uploadedFileName) {
    console.log('No filename available');
    return false;
  }

  setSuggestionsStatus("loading");
  
  try {
    console.log('Fetching recommendations...');
    
    // ✅ USE authFetch INSTEAD OF fetch
    const response = await authFetch(
      `http://localhost:8002/api/project/recommendation?filename=${encodeURIComponent(uploadedFileName)}`
    );
    
    if (!response.ok) {
      console.log('Response not OK:', response.status);
      throw new Error('Failed to get recommendations');
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    setSuggestions(data);
    setSuggestionsStatus("success");
    return true;
    
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    setSuggestionsStatus("error");
    showMessage(error.message || "Failed to load project suggestions", "error");
    return false;
  }
};

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Validations
  const validateStep1 = () => {
    const nextErrors = {};
    const days = parseInt(form.internshipDays, 10);
    const students = parseInt(form.numberOfStudents, 10);

    if (!students || students < 1) nextErrors.numberOfStudents = "Please enter a valid number of students";
    if (!String(form.startDate || "").trim()) nextErrors.startDate = "Start date is required";
    if (!days || days < 1) nextErrors.internshipDays = "Please enter a valid number of days";
    if (!String(form.internshipType || "").trim()) nextErrors.internshipType = "Type of internship is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    if (!uploadedFileName) nextErrors.document = "Please upload a PDF document";
    setErrors(nextErrors);
    if (nextErrors.document) showMessage(nextErrors.document, "error");
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep3 = () => {
    const nextErrors = {};
    if (!selectedTopic) nextErrors.topic = "Please select a suggested project topic";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateCurrent = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return true;
  };

  const goPrev = () => setCurrentStep((s) => Math.max(1, s - 1));
  
  // GO NEXT FUNCTION (REPLACED THE DUPLICATE)
  const goNext = async () => {
  console.log('goNext called, currentStep:', currentStep);
  console.log('uploadedFileName:', uploadedFileName);
  
  if (currentStep === 2) {
    if (!uploadedFileName) {
      console.log('No file uploaded, showing error');
      setErrors({...errors, document: "Please upload a CV file"});
      return;
    }
    
    console.log('Fetching recommendations...');
    const success = await fetchProjectRecommendations();
    
    if (!success) {
      console.log('Failed to fetch recommendations');
      setErrors({...errors, topic: "Failed to load project suggestions"});
      return;
    }
    console.log('Recommendations fetched successfully');
  }
  
  if (!validateCurrent()) {
    console.log('Validation failed');
    return;
  }
  
  console.log('Moving to next step');
  setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
};

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateCurrent()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (uploadedFile) formData.append("document", uploadedFile);
    if (selectedTopic) formData.append("selectedTopic", selectedTopic);

    setSubmitting(true);
    showMessage("Submitting your application...", "info");

    // Simulated submit
    setTimeout(() => {
      setSubmitting(false);
      showMessage("Application submitted successfully!", "success");
      resetForm();
    }, 1500);

    console.log("Form submitted with data:", {
      ...form,
      file: uploadedFile ? uploadedFile.name : null,
      selectedTopic,
    });
  };

  const resetForm = () => {
    setForm({
      numberOfStudents: "",
      startDate: "",
      internshipDays: "",
      internshipType: "",
    });
    setUploadedFile(null);
    setUploadedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCurrentStep(1);
    setErrors({});
    setSuggestions([]);
    setSuggestionsStatus("idle");
    setSelectedTopic(null);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const fetchProjectPlan = async () => {
  try {
    // ✅ USE authFetch INSTEAD OF fetch
    const response = await authFetch(
      `http://localhost:8002/api/project/plan/generate?projectName=${encodeURIComponent(selectedTopic)}&internshipDays=${encodeURIComponent(form.internshipDays)}&cvFilename=${encodeURIComponent(uploadedFileName)}`
    );
    
    if (!response.ok) throw new Error("Failed to fetch project plan");
    
    return await response.json();
  } catch (err) {
    console.error("Error fetching project plan:", err);
    showMessage(err.message || "Failed to generate project plan", "error");
    return null;
  }
};

  // ... (keep your existing JSX return statement)

  return (
    <div className={`app-root step-${currentStep}`}>
      <div className="background-pattern" />
      <div className="floating-element floating-1" />
      <div className="floating-element floating-2" />
      <div className="floating-element floating-3" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-icon">
            <img src="/logoproxym.png" alt="Header icon" width="40" height="40" />
          </div>
          <h1 className="main-title">WELCOME</h1>
          <p className="main-description">
            Reimagine internship and project allocation with our AI-Powered Subject Recommender. Connect the right students with the right opportunities to drive growth and innovation
          </p>
        </div>

        {/* Form */}
        <div className="form-container">
          <div className="progress-header">
            <div className="progress-header-top">
              <h2>Progress</h2>
              <div className="step-badge">
                <span id="current-step">{currentStep}</span> of <span id="total-steps">{TOTAL_STEPS}</span>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" id="progress-fill" />
            </div>

            <div className="progress-labels">
              {[
                { id: 1, label: "Program Details" },
                { id: 2, label: "Documents" },
                { id: 3, label: "Review & Topics" },
              ].map((s) => (
                <span
                  key={s.id}
                  className={`progress-label ${currentStep >= s.id ? "active" : ""}`}
                  id={`label-${s.id}`}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          <div className="form-card">
            <form id="internship-form" onSubmit={onSubmit}>
              {/* STEP 1 — Program Details */}
              <div className={`form-step ${currentStep === 1 ? "active" : ""}`} id="step-1">
                <div className="step-header">
                  <div className="step-icon step-icon-green">
                    {/* Timer icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <h2>Program Details</h2>
                  <p>Configure the specifics of your internship program</p>
                </div>

                {/* ORDER: Students → Start Date → Duration → Type */}
                <div className="form-grid form-grid-2 form-grid-3-cols balanced-row">
                  {/* Students */}
                  <div className="form-group-large group-rows">
                    <label htmlFor="number-students">Number of Students</label>
                    <div className="input-with-badge input-with-icon">
                      <span className="leading-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </span>
                      <input
                        type="number"
                        id="number-students"
                        name="numberOfStudents"
                        placeholder="e.g., 15"
                        min="1"
                        value={form.numberOfStudents}
                        onChange={onInput("numberOfStudents")}
                        onBlur={() =>
                          errors.numberOfStudents && setErrors((e) => ({ ...e, numberOfStudents: undefined }))
                        }
                        className={errors.numberOfStudents ? "input-error" : ""}
                      />
                      <span className="input-badge badge-blue">Students</span>
                    </div>
                    <div className="field-foot">
                      <p className="help-text">Recommended: 5–25 students per program</p>
                      {errors.numberOfStudents && <div className="field-error">{errors.numberOfStudents}</div>}
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="form-group-large group-rows center-col">
                    <label htmlFor="start-date">Start Date</label>
                    <div className="input-with-icon">
                      <span className="leading-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="date"
                        id="start-date"
                        name="startDate"
                        value={form.startDate}
                        onChange={onInput("startDate")}
                        onBlur={() => errors.startDate && setErrors((e) => ({ ...e, startDate: undefined }))}
                        className={errors.startDate ? "input-error" : ""}
                      />
                    </div>
                    <div className="field-foot">
                      <p className="help-text invisible">spacer</p>
                      {errors.startDate && <div className="field-error">{errors.startDate}</div>}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="form-group-large group-rows">
                    <label htmlFor="internship-days">Duration (Days)</label>
                    <div className="input-with-badge input-with-icon">
                      <span className="leading-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                      </span>
                      <input
                        type="number"
                        id="internship-days"
                        name="internshipDays"
                        placeholder="e.g., 90"
                        min="1"
                        value={form.internshipDays}
                        onChange={onInput("internshipDays")}
                        onBlur={() => errors.internshipDays && setErrors((e) => ({ ...e, internshipDays: undefined }))}
                        className={errors.internshipDays ? "input-error" : ""}
                      />
                      <span className="input-badge badge-green">Days</span>
                    </div>
                    <div className="field-foot">
                      <p className="help-text">Typical programs run 60–120 days</p>
                      {errors.internshipDays && <div className="field-error">{errors.internshipDays}</div>}
                    </div>
                  </div>
                </div>

                {/* Type of Internship — free text */}
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="internship-type-text">Type of Internship</label>
                    <input
                      type="text"
                      id="internship-type-text"
                      name="internshipType"
                      placeholder="e.g., Summer, Research, Graduate..."
                      value={form.internshipType}
                      onChange={onInput("internshipType")}
                      onBlur={() =>
                        errors.internshipType && setErrors((e) => ({ ...e, internshipType: undefined }))
                      }
                      className={errors.internshipType ? "input-error" : ""}
                    />
                    {errors.internshipType && <div className="field-error">{errors.internshipType}</div>}
                  </div>
                </div>
              </div>

              {/* STEP 2 — Documents (Summary → Upload Header → Upload Wrapper) */}
              <div className={`form-step ${currentStep === 2 ? "active" : ""}`} id="step-2">
                {/* 1) Program Summary */}
                <div className="summary-card step2-spacing-lg">
                  <h3>Program Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item"><span>Type:</span><span>{summary.internshipType}</span></div>
                    <div className="summary-item"><span>Start Date:</span><span id="summary-start-date">{summary.startDate}</span></div>
                    <div className="summary-item"><span>Duration:</span><span id="summary-duration">{summary.duration}</span></div>
                    <div className="summary-item"><span>Students:</span><span id="summary-students">{summary.students}</span></div>
                  </div>
                </div>

                {/* 2) Upload Header (document icon above area) */}
                <div className="upload-header step2-spacing-md">
                  <div className="step-icon step-icon-purple">
                    {/* Document icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                </div>

                {/* 3) Upload Wrapper (compact) */}
                <div className="upload-wrapper step2-spacing-md">
                  <div
                    className={`upload-area ${isDragOver ? "dragover" : ""} ${uploadedFile ? "uploaded" : ""}`}
                    id="upload-area"
                    ref={uploadAreaRef}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer?.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  >
                    <input
                      type="file"
                      id="file-input"
                      ref={fileInputRef}
                      accept=".pdf"
                      hidden
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />

                    {!uploadedFileName && (
                      <div className="upload-content" id="upload-content">
                        <div className="upload-icon-inner">
                          {/* DOWNLOAD ICON — now fully stroked and visible */}
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <line x1="12" y1="3" x2="12" y2="15" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="5" y1="21" x2="19" y2="21" />
                          </svg>
                        </div>
                        <div className="upload-text">
                          <p>
                            Drop your PDF here, or
                            <button
                              type="button"
                              id="browse-btn"
                              className="browse-link"
                              onClick={() => fileInputRef.current?.click()}
                            >browse files
                            </button>
                          </p>
                          <p className="upload-help">PDF files only, max 10MB</p>
                        </div>
                      </div>
                    )}

                    {uploadedFileName && (
                      <div className="upload-success" id="upload-success">
                        <div className="success-content">
                          <div className="success-icon">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14,2 14,8 20,8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                          </div>
                          <div className="success-info">
                            <p id="file-name">{uploadedFile.name}</p>
                            <p id="file-size">{formatFileSize(uploadedFile.size)}</p>
                            <div className="success-badge">
                              <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22,4 12,14.01 9,11.01" />
                              </svg>
                              Uploaded
                            </div>
                          </div>
                          <button type="button" id="remove-file" className="remove-btn" onClick={removeFile}>
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!uploadedFileName && (
                    <div className="upload-button-container" id="upload-button-container">
                      <button
                        type="button"
                        id="upload-btn"
                        className="upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Choose File
                      </button>
                    </div>
                  )}
                  {errors.document && <div className="field-error">{errors.document}</div>}
                </div>
              </div>

              {/* STEP 3 — Review & Topics */}
              <div className={`form-step ${currentStep === 3 ? "active" : ""}`} id="step-3">
                <div className="step-header">
                  <div className="step-icon step-icon-purple">
                    {/* LIST ICON — for Review & Topics */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="9" y1="6" x2="21" y2="6" />
                      <line x1="9" y1="12" x2="21" y2="12" />
                      <line x1="9" y1="18" x2="21" y2="18" />
                      <circle cx="4" cy="6" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="4" cy="18" r="1.5" />
                    </svg>
                  </div>
                  <h2>Review & Project Topics</h2>
                  <p>Review your details and select a suggested project topic</p>
                </div>

                <div className="summary-card summary-to-suggestions-gap">
                  <h3>Quick Review</h3>
                  <div className="summary-grid">
                    <div className="summary-item"><span>Type:</span><span>{summary.internshipType}</span></div>
                    <div className="summary-item"><span>Start Date:</span><span>{summary.startDate}</span></div>
                    <div className="summary-item"><span>Duration:</span><span>{summary.duration}</span></div>
                    <div className="summary-item"><span>Students:</span><span>{summary.students}</span></div>
                  </div>
                </div>

                <div className="summary-card">
                  <h3>Suggested Project Topics</h3>

                  {suggestionsStatus === "loading" && <p className="help-text">Loading suggestions…</p>}

                  {suggestionsStatus === "error" && (
                    <div>
                      <p className="help-text error-text">Couldn’t load suggestions from the server.</p>
                      <button
                        type="button"
                        className="nav-btn nav-btn-secondary"
                        onClick={() => {
                          setSuggestionsStatus("loading");
                          fetch("/api/suggestions?limit=3")
                            .then(async (res) => {
                              if (!res.ok) throw new Error("Failed to fetch suggestions");
                              const data = await res.json();
                              if (!data?.topics || !Array.isArray(data.topics)) throw new Error("Invalid response");
                              setSuggestions(data.topics.slice(0, 3));
                              setSuggestionsStatus("success");
                            })
                            .catch(() => setSuggestionsStatus("error"));
                        }}
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {suggestionsStatus === "success" && suggestions.length > 0 && (
                    <div className="suggestion-grid">
                      {suggestions.map((projectIdea, idx) => ( // ← Define projectIdea here
                        <label
                           key={idx}
                           className={`suggestion-card ${selectedTopic === projectIdea ? "selected" : ""}`}
                          onClick={() => setSelectedTopic(projectIdea)}
                        >
                          <input
                            type="radio"
                            name="project-topic"
                            checked={selectedTopic === projectIdea} // ← Use projectIdea here
                            onChange={() => setSelectedTopic(projectIdea)} // ← And here
                            required
                          />
                          <div className="suggestion-text">
                            <strong>{projectIdea.name}</strong> {/* ← And here */}
                            <br />
                            <small>{projectIdea.description}</small> {/* ← And here */}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {suggestionsStatus === "success" && suggestions.length === 0 && (
                    <p className="help-text">No suggestions available.</p>
                  )}

                  {errors.topic && <div className="field-error">{errors.topic}</div>}

                  <p className="help-text footnote">Choosing a topic is required to proceed.</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="form-navigation">
                <button
                  type="button"
                  id="prev-btn"
                  className="nav-btn nav-btn-secondary"
                  onClick={goPrev}
                  disabled={currentStep === 1}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>

                {currentStep < TOTAL_STEPS && (
                  <button type="button" id="next-btn" className="nav-btn nav-btn-primary" onClick={goNext}>
                    Next Step
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                )}

                {currentStep === TOTAL_STEPS && (
                  <button
                      type="button"
                      id="submit-btn"
                       className="nav-btn nav-btn-success" 
                      disabled={submitting}
                      onClick={async () => {
                        setSubmitting(true);
                        const plan = await fetchProjectPlan();
                        setSubmitting(false);

                        if (plan) {
                          navigate("/Report-Page", { state: { plan } });
                        } else {
                          showMessage("Failed to generate project plan. Please try again.", "error");
                        }
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                      </svg>
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  )}

              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Support</a>
            <a href="#">Contact Us</a>
          </div>
          <p>Need assistance? Our support team is available 24/7 to help you succeed.</p>
        </div>
      </div>

      {/* Toast */}
      {message && <div className={`message message-${message.type || "neutral"}`}>{message.text}</div>}
    </div>
  );
}
