import React, { useEffect, useMemo, useState } from "react";
import "./Result.css";

export default function Result() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // Read ?id=... from the URL
  const search = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const reportId = search?.get("id") || "";

  useEffect(() => {
    let ignore = false;

    async function fetchReport() {
      try {
        setLoading(true);
        setError(null);

        // Replace with your backend endpoint & auth as needed
        const res = await fetch(`/api/result?id=${encodeURIComponent(reportId)}`, {
          headers: { "Accept": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load result");
        const data = await res.json();
        if (!ignore) setReport(data);
      } catch (e) {
        if (!ignore) setError(e.message || "Something went wrong");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchReport();
    return () => { ignore = true; };
  }, [reportId]);

  const meta = useMemo(() => {
    if (!report) return null;
    return {
      submissionId: report.submissionId || "—",
      submittedAt: report.submittedAt ? new Date(report.submittedAt).toLocaleString() : "—",
      organization: report.organization || "—",
      department: report.department || "—",
    };
  }, [report]);

  // Key stats come from backend (fallbacks provided)
  const stats = useMemo(() => {
    if (!report) return null;
    return {
      internshipType: report.internshipType || "—",
      startDate: report.startDate || "—",
      durationDays: report.durationDays ? `${report.durationDays} days` : "— days",
      students: report.students ? `${report.students} students` : "— students",
      selectedTopic: report.selectedTopic || "—",
    };
  }, [report]);

  const suggestions = report?.suggestions || []; // [{topic, score}]
  const insights = report?.insights || [];       // array of strings
  const candidates = report?.candidates || [];   // [{name, score, skills:[] }]

  const downloadUrl = report?.downloadUrl || null;
  const shareUrl = report?.shareUrl || null;

  return (
    <div className="result-root">
      {/* Background */}
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
          <h1 className="main-title">Application Result</h1>
          <p className="main-description">
            Here’s your AI-generated internship report — topics, matches, and next steps in one place.
          </p>
        </div>

        {/* Content card */}
        <div className="result-card">
          {/* Top Row: Title + Meta */}
          <div className="result-top">
            <div className="result-title">
              <div className="step-icon step-icon-purple">
                {/* Document Check Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 14 11 16 15 12" />
                </svg>
              </div>
              <div className="result-title-text">
                <h2>Report</h2>
                <p>AI summary and recommendations</p>
              </div>
            </div>

            <div className="result-meta">
              {loading ? (
                <div className="meta-skeleton">
                  <span className="chip-skeleton" />
                  <span className="chip-skeleton" />
                  <span className="chip-skeleton" />
                </div>
              ) : (
                <>
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {meta?.submittedAt}
                  </span>
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 21h18"/>
                      <path d="M5 21V7l8-4v18"/>
                      <path d="M19 21V11l-6-4"/>
                    </svg>
                    {meta?.organization}
                  </span>
                  <span className="meta-chip">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
                      <line x1="12" y1="22" x2="12" y2="15.5" />
                    </svg>
                    {meta?.department}
                  </span>
                  <span className="meta-chip id-chip">
                    ID: {meta?.submissionId}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="error-box">
              <p>We couldn’t load the report. Please try again.</p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="skeleton-stack">
              <div className="skeleton-row" />
              <div className="skeleton-row wide" />
              <div className="skeleton-row" />
              <div className="skeleton-grid">
                <div className="skeleton-tile" />
                <div className="skeleton-tile" />
                <div className="skeleton-tile" />
                <div className="skeleton-tile" />
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && report && (
            <>
              {/* Key Stats */}
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-label">Selected Topic</span>
                  <span className="stat-value">{stats.selectedTopic}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Internship Type</span>
                  <span className="stat-value">{stats.internshipType}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Start Date</span>
                  <span className="stat-value">{stats.startDate}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Duration</span>
                  <span className="stat-value">{stats.durationDays}</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">Students</span>
                  <span className="stat-value">{stats.students}</span>
                </div>
              </div>

              {/* Insights */}
              <div className="section-card">
                <div className="section-head">
                  <div className="section-icon section-icon-blue">
                    {/* Sparkles / stars */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 3l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" transform="translate(5 1) scale(0.7)"/>
                      <path d="M12 8l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" transform="translate(6 5)"/>
                    </svg>
                  </div>
                  <div>
                    <h3>AI Insights</h3>
                    <p>Highlights extracted from the uploaded CVs and program settings</p>
                  </div>
                </div>
                {insights.length === 0 ? (
                  <p className="help-text">No insights available.</p>
                ) : (
                  <ul className="bullet-list">
                    {insights.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Suggested Topics with Scores */}
              <div className="section-card">
                <div className="section-head">
                  <div className="section-icon step-icon-purple">
                    {/* List icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="9" y1="6" x2="21" y2="6" />
                      <line x1="9" y1="12" x2="21" y2="12" />
                      <line x1="9" y1="18" x2="21" y2="18" />
                      <circle cx="4" cy="6" r="1.5" />
                      <circle cx="4" cy="12" r="1.5" />
                      <circle cx="4" cy="18" r="1.5" />
                    </svg>
                  </div>
                  <div>
                    <h3>Suggested Topics</h3>
                    <p>Auto-ranked based on skill match and interests found in CVs</p>
                  </div>
                </div>

                {suggestions.length === 0 ? (
                  <p className="help-text">No topics suggested.</p>
                ) : (
                  <div className="topic-grid">
                    {suggestions.map((t, idx) => (
                      <div className="topic-card" key={idx}>
                        <div className="topic-title">{t.topic || "Untitled Topic"}</div>
                        <div className="topic-score">
                          <span className="score-bar">
                            <span
                              className="score-fill"
                              style={{ width: `${Math.max(0, Math.min(100, Math.round((t.score || 0) * 100)))}%` }}
                            />
                          </span>
                          <span className="score-text">{Math.round((t.score || 0) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Candidates */}
              <div className="section-card">
                <div className="section-head">
                  <div className="section-icon step-icon-green">
                    {/* Users icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Top Candidate Matches</h3>
                    <p>Best-fitting candidates based on skills & interests</p>
                  </div>
                </div>

                {candidates.length === 0 ? (
                  <p className="help-text">No candidate matches available.</p>
                ) : (
                  <div className="candidate-table">
                    <div className="ct-head">
                      <span>Name</span>
                      <span>Match</span>
                      <span>Key Skills</span>
                    </div>
                    <div className="ct-body">
                      {candidates.map((c, i) => (
                        <div className="ct-row" key={i}>
                          <span className="ct-name">{c.name}</span>
                          <span className="ct-score">
                            <span className="score-chip">{Math.round((c.score || 0) * 100)}%</span>
                          </span>
                          <span className="ct-skills">
                            {(c.skills || []).slice(0, 5).map((s, k) => (
                              <span className="skill-chip" key={k}>{s}</span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="result-actions">
                {downloadUrl && (
                  <a className="nav-btn nav-btn-primary" href={downloadUrl} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <line x1="12" y1="3" x2="12" y2="15" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="5" y1="21" x2="19" y2="21" />
                    </svg>
                    Download PDF
                  </a>
                )}

                {shareUrl && (
                  <a className="nav-btn nav-btn-secondary" href={shareUrl} target="_blank" rel="noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Share
                  </a>
                )}

                <a className="nav-btn nav-btn-success" href="/">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                  Start New Application
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
