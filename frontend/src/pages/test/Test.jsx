import React, { useEffect, useMemo, useRef, useState } from "react";
import './Test.css';

export default function InternshipPortal() {
  // ----- Constants -----
  const TOTAL_STEPS = 3;

  // ----- State -----
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [message, setMessage] = useState(null); // { text, type }
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    department: "",
    startDate: "",
    description: "",
    internshipDays: "",
    numberOfStudents: "",
  });

  const [errors, setErrors] = useState({});

  // ----- Refs -----
  const fileInputRef = useRef(null);
  const uploadAreaRef = useRef(null);

  // ----- Derived -----
  const progressPercent = useMemo(
    () => Math.min(100, Math.max(0, (currentStep / TOTAL_STEPS) * 100)),
    [currentStep]
  );

  const summary = useMemo(
    () => ({
      duration: form.internshipDays ? `${form.internshipDays} days` : "— days",
      students: form.numberOfStudents ? `${form.numberOfStudents} students` : "— students",
      startDate: form.startDate || "—",
      department: form.department || "—",
    }),
    [form]
  );

  // ----- Effects -----
  useEffect(() => {
    // Smooth scroll behavior
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, []);

  useEffect(() => {
    // Prevent default drag behaviors on the whole page (to stop the browser from opening the PDF)
    const preventDefaults = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  // ----- Helpers -----
  const showMessage = (text, type = "info") => {
    setMessage({ text, type });
    // Auto-hide after 5s
    const t = setTimeout(() => setMessage(null), 5000);
    return () => clearTimeout(t);
  };

  const inputStyle = (field) => (errors[field] ? { borderColor: "#dc2626" } : undefined);

  const onInput = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const req = ["companyName", "department", "startDate", "description"];
    const nextErrors = {};
    req.forEach((field) => {
      if (!String(form[field] || "").trim()) nextErrors[field] = "This field is required";
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const nextErrors = {};
    const days = parseInt(form.internshipDays, 10);
    const students = parseInt(form.numberOfStudents, 10);
    if (!days || days < 1) nextErrors.internshipDays = "Please enter a valid number of days";
    if (!students || students < 1) nextErrors.numberOfStudents = "Please enter a valid number of students";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep3 = () => {
    if (!uploadedFile) {
      showMessage("Please upload a PDF document to continue", "error");
      return false;
    }
    return true;
  };

  const validateCurrent = () => {
    if (currentStep === 1) return validateStep1();
    if (currentStep === 2) return validateStep2();
    if (currentStep === 3) return validateStep3();
    return true;
  };

  const goPrev = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const goNext = () => {
    if (!validateCurrent()) return;
    setCurrentStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateCurrent()) return;

    // Build form data
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (uploadedFile) formData.append("document", uploadedFile);

    // Simulate API call
    setSubmitting(true);
    showMessage("Submitting your application...", "info");

    setTimeout(() => {
      setSubmitting(false);
      showMessage("Application submitted successfully!", "success");
      resetForm();
    }, 2000);

    // Log for demonstration
    // eslint-disable-next-line no-console
    console.log("Form submitted with data:", {
      ...form,
      file: uploadedFile ? uploadedFile.name : null,
    });
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      department: "",
      startDate: "",
      description: "",
      internshipDays: "",
      numberOfStudents: "",
    });
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setCurrentStep(1);
    setErrors({});
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    // Type check
    if (file.type !== "application/pdf") {
      showMessage("Please upload a PDF file only.", "error");
      return;
    }
    // Size check (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showMessage("File size must be less than 10MB.", "error");
      return;
    }
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ----- Render -----
  return (
    <div className="app-root">
      {/* Inline keyframes for toasts (matches original behavior) */}
      <style>{`
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
      `}</style>

      {/* Background Pattern */}
      <div className="background-pattern" />

      {/* Floating Elements */}
      <div className="floating-element floating-1" />
      <div className="floating-element floating-2" />
      <div className="floating-element floating-3" />

      <div className="container">
        {/* Header Section */}
        <div className="header">
          <div className="header-icon">
            <img 
            src="/logoproxym.png"   // adjust the path
            alt="Header icon"
            width="40"
            height="40"
            />
</div>

          <h1 className="main-title">Internship Portal</h1>

          <p className="main-description">
            Transform your organization's talent pipeline with our comprehensive internship management platform.
            Connect with top students and build tomorrow's workforce today.
          </p>

          {/* Feature Stats */}
          <div className="feature-stats">
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>10,000+</h3>
              <p>Students Connected</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </div>
              <h3>500+</h3>
              <p>Partner Companies</p>
            </div>

            <div className="stat-card">
              <div className="stat-icon stat-icon-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="form-container">
          {/* Progress Header */}
          <div className="progress-header">
            <div className="progress-header-top">
              <h2>Internship Application</h2>
              <div className="step-badge">
                <span id="current-step">{currentStep}</span> of <span id="total-steps">{TOTAL_STEPS}</span>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" id="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <div className="progress-labels">
              {[
                { id: 1, label: "Company Info" },
                { id: 2, label: "Program Details" },
                { id: 3, label: "Documents" },
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

          {/* Main Form Card */}
          <div className="form-card">
            <form id="internship-form" onSubmit={onSubmit}>
              {/* Step 1: Company Information */}
              <div className={`form-step ${currentStep === 1 ? "active" : ""}`} id="step-1">
                <div className="step-header">
                  <div className="step-icon step-icon-blue">
                    <img src="/logoproxym.png"   alt="Header icon" width="40" height="40"/>
                  </div>
                  <h2>Company Information</h2>
                  <p>Tell us about your organization and internship program</p>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="company-name">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4v18" />
                        <path d="M19 21V11l-6-4" />
                      </svg>
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company-name"
                      name="companyName"
                      placeholder="Enter company name"
                      value={form.companyName}
                      onChange={onInput("companyName")}
                      onBlur={() => errors.companyName && setErrors((e) => ({ ...e, companyName: undefined }))}
                      style={inputStyle("companyName")}
                    />
                    {errors.companyName && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.companyName}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                        <line x1="12" y1="22" x2="12" y2="15.5" />
                        <polyline points="22,8.5 12,15.5 2,8.5" />
                        <polyline points="2,15.5 12,8.5 22,15.5" />
                        <polyline points="12,2 12,8.5" />
                      </svg>
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      placeholder="e.g., Engineering, Marketing"
                      value={form.department}
                      onChange={onInput("department")}
                      onBlur={() => errors.department && setErrors((e) => ({ ...e, department: undefined }))}
                      style={inputStyle("department")}
                    />
                    {errors.department && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.department}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="start-date">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start-date"
                      name="startDate"
                      value={form.startDate}
                      onChange={onInput("startDate")}
                      onBlur={() => errors.startDate && setErrors((e) => ({ ...e, startDate: undefined }))}
                      style={inputStyle("startDate")}
                    />
                    {errors.startDate && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.startDate}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10,9 9,9 8,9" />
                      </svg>
                      Brief Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Brief program description"
                      value={form.description}
                      onChange={onInput("description")}
                      onBlur={() => errors.description && setErrors((e) => ({ ...e, description: undefined }))}
                      style={inputStyle("description")}
                    />
                    {errors.description && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.description}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2: Program Details */}
              <div className={`form-step ${currentStep === 2 ? "active" : ""}`} id="step-2">
                <div className="step-header">
                  <div className="step-icon step-icon-green">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <h2>Program Details</h2>
                  <p>Configure the specifics of your internship program</p>
                </div>

                <div className="form-grid form-grid-2">
                  <div className="form-group-large">
                    <label htmlFor="internship-days">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Duration (Days)
                    </label>
                    <div className="input-with-badge">
                      <input
                        type="number"
                        id="internship-days"
                        name="internshipDays"
                        placeholder="e.g., 90"
                        value={form.internshipDays}
                        onChange={onInput("internshipDays")}
                        onBlur={() => errors.internshipDays && setErrors((e) => ({ ...e, internshipDays: undefined }))}
                        style={inputStyle("internshipDays")}
                      />
                      <span className="input-badge badge-green">Days</span>
                    </div>
                    <p className="help-text">Typical programs run 60-120 days</p>
                    {errors.internshipDays && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.internshipDays}</div>
                    )}
                  </div>

                  <div className="form-group-large">
                    <label htmlFor="number-students">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Number of Students
                    </label>
                    <div className="input-with-badge">
                      <input
                        type="number"
                        id="number-students"
                        name="numberOfStudents"
                        placeholder="e.g., 15"
                        value={form.numberOfStudents}
                        onChange={onInput("numberOfStudents")}
                        onBlur={() => errors.numberOfStudents && setErrors((e) => ({ ...e, numberOfStudents: undefined }))}
                        style={inputStyle("numberOfStudents")}
                      />
                      <span className="input-badge badge-blue">Students</span>
                    </div>
                    <p className="help-text">Recommended: 5-25 students per program</p>
                    {errors.numberOfStudents && (
                      <div className="field-error" style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: 4 }}>{errors.numberOfStudents}</div>
                    )}
                  </div>
                </div>

                <div className="summary-card">
                  <h3>Program Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span>Duration:</span>
                      <span id="summary-duration">{summary.duration}</span>
                    </div>
                    <div className="summary-item">
                      <span>Students:</span>
                      <span id="summary-students">{summary.students}</span>
                    </div>
                    <div className="summary-item">
                      <span>Start Date:</span>
                      <span id="summary-start-date">{summary.startDate}</span>
                    </div>
                    <div className="summary-item">
                      <span>Department:</span>
                      <span id="summary-department">{summary.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Document Upload */}
              <div className={`form-step ${currentStep === 3 ? "active" : ""}`} id="step-3">
                <div className="step-header">
                  <div className="step-icon step-icon-purple">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7,10 12,15 17,10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </div>
                  <h2>Document Upload</h2>
                  <p>Upload your program documentation</p>
                </div>

                <div className="upload-container">
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
                    {/* Hidden input */}
                    <input
                      type="file"
                      id="file-input"
                      ref={fileInputRef}
                      accept=".pdf"
                      hidden
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />

                    {/* Upload content */}
                    {!uploadedFile && (
                      <div className="upload-content" id="upload-content">
                        <div className="upload-icon">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
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
                              style={{ marginLeft: 6 }}
                            >
                              browse files
                            </button>
                          </p>
                          <p className="upload-help">PDF files only, max 10MB</p>
                        </div>
                      </div>
                    )}

                    {/* Upload success */}
                    {uploadedFile && (
                      <div className="upload-success" id="upload-success" style={{ display: "block" }}>
                        <div className="success-content">
                          <div className="success-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14,2 14,8 20,8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                              <polyline points="10,9 9,9 8,9" />
                            </svg>
                          </div>
                          <div className="success-info">
                            <p id="file-name">{uploadedFile.name}</p>
                            <p id="file-size">{formatFileSize(uploadedFile.size)}</p>
                            <div className="success-badge">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22,4 12,14.01 9,11.01" />
                              </svg>
                              Uploaded
                            </div>
                          </div>
                          <button type="button" id="remove-file" className="remove-btn" onClick={removeFile}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!uploadedFile && (
                    <div className="upload-button-container" id="upload-button-container">
                      <button
                        type="button"
                        id="upload-btn"
                        className="upload-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7,10 12,15 17,10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Choose File
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="form-navigation">
                <button type="button" id="prev-btn" className="nav-btn nav-btn-secondary" onClick={goPrev} disabled={currentStep === 1}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Previous
                </button>

                {currentStep < TOTAL_STEPS && (
                  <button type="button" id="next-btn" className="nav-btn nav-btn-primary" onClick={goNext}>
                    Next Step
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                )}

                {currentStep === TOTAL_STEPS && (
                  <button type="submit" id="submit-btn" className="nav-btn nav-btn-success" disabled={submitting}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    {submitting ? "Submitting..." : "Submit Application"}
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

      {/* Toast message */}
      {message && (
        <div
          className={`message message-${message.type}`}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            padding: "12px 24px",
            borderRadius: 8,
            color: "white",
            fontWeight: 500,
            zIndex: 1000,
            animation: "slideInRight 0.3s ease-out",
            background:
              message.type === "success"
                ? "#10b981"
                : message.type === "error"
                ? "#dc2626"
                : message.type === "info"
                ? "#3b82f6"
                : "#6b7280",
          }}
          onAnimationEnd={(e) => {
            // When about to unmount, play slideOut
            if (!message) {
              e.currentTarget.style.animation = "slideOutRight 0.3s ease-in forwards";
            }
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
