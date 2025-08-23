import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  // Load plan from navigation state or sessionStorage
  useEffect(() => {
    let mounted = true;

    const loadPlan = () => {
      const navPlan = location?.state?.plan ?? location?.state?.report ?? null;
      if (navPlan) {
        try {
          sessionStorage.setItem("projectPlan", JSON.stringify(navPlan));
        } catch {}
        if (mounted) {
          setReport(navPlan);
          setLoading(false);
        }
        return;
      }

      try {
        const stored = sessionStorage.getItem("projectPlan");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (mounted) {
            setReport(parsed);
            setLoading(false);
          }
          return;
        }
      } catch {}

      if (mounted) {
        setError("No project plan found. Please go back and submit the form.");
        setLoading(false);
      }
    };

    loadPlan();
    return () => {
      mounted = false;
    };
  }, [location]);

  // Map backend schema → local vars
  const po = report?.projectOverview ?? {};
  const weeks = Array.isArray(report?.timeline) ? report.timeline : [];
  const successMethod = report?.success?.method ?? "—";
  const successTalkingPoints = Array.isArray(report?.success?.talkingPoints)
    ? report.success.talkingPoints
    : [];
  const nextActions = Array.isArray(report?.nextSteps?.actions)
    ? report.nextSteps.actions
    : [];

  // Stats
  const stats = useMemo(() => {
    const totalWeeks = weeks.length
      ? `${weeks.length} week${weeks.length > 1 ? "s" : ""}`
      : "—";
    return {
      projectTitle: po.projectTitle ?? "—",
      totalWeeks,
      successMethod,
      frontend: po.techStack?.frontend ?? "—",
      backend: po.techStack?.backend ?? "—",
    };
  }, [po, weeks, successMethod]);

  // Helpers
  const splitHelpfulItem = (s) =>
    String(s || "").replace(/^\s*-\s*/, "").trim();

  const parseWeeklyTasks = (summary) => {
    if (!summary) return [];
    return String(summary)
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "))
      .map((l) => l.replace(/^\s*-\s*/, "").trim());
  };

  const firstSentence = (text) => {
    const str = String(text || "").trim();
    if (!str) return "—";
    const idx = str.indexOf("\n");
    return idx > -1 ? str.slice(0, idx) : str;
  };

  const downloadUrl = report?.downloadUrl || null;

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="result-page">
      {/* Background */}
      <div className="result-bg-pattern" />
      <div className="result-floating result-floating-1" />
      <div className="result-floating result-floating-2" />
      <div className="result-floating result-floating-3" />

      <div className="result-container">
        {/* Header */}
        <div className="result-header">
          <div className="result-header-icon">
            <img src="/logoproxym.png" alt="Header icon" width="40" height="40" />
          </div>
          <h1 className="result-title-hero">Result</h1>
          <p className="result-subtitle-hero">
            AI-generated internship report based on the selected topic and uploaded documents.
          </p>
        </div>

        {/* Card */}
        <div className="result-card">
          {/* Top - Title only (meta removed) */}
          <div className="result-top">
            <div className="result-title">
              <div className="result-step-icon result-step-icon-purple">
                {/* Document Check Icon */}
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 14 11 16 15 12" />
                </svg>
              </div>
              <div className="result-title-text">
                <h2>Report</h2>
                <p>Project overview, tasks, timeline, and deliverables</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && <div className="result-error">We couldn’t load the report. Please try again.</div>}

          {/* Loading */}
          {loading && !error && (
            <div className="result-skeleton">
              <div className="result-skel-row" />
              <div className="result-skel-row result-skel-wide" />
              <div className="result-skel-row" />
              <div className="result-skel-grid">
                <div className="result-skel-tile" />
                <div className="result-skel-tile" />
                <div className="result-skel-tile" />
                <div className="result-skel-tile" />
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Stats Grid (kept) */}
              <div className="result-stats-grid">
                <div className="result-stat-box">
                  <span className="result-stat-label">Project Title</span>
                  <span className="result-stat-value">{stats.projectTitle}</span>
                </div>
                <div className="result-stat-box">
                  <span className="result-stat-label">Total Duration</span>
                  <span className="result-stat-value">{stats.totalWeeks}</span>
                </div>
                <div className="result-stat-box">
                  <span className="result-stat-label">Success Method</span>
                  <span className="result-stat-value">{stats.successMethod}</span>
                </div>
                <div className="result-stat-box">
                  <span className="result-stat-label">Frontend</span>
                  <span className="result-stat-value">{stats.frontend}</span>
                </div>
                <div className="result-stat-box">
                  <span className="result-stat-label">Backend</span>
                  <span className="result-stat-value">{stats.backend}</span>
                </div>
              </div>

              {/* Project Description */}
              <section className="result-section">
                <div className="result-section-head">
                  <div className="result-step-icon result-step-icon-blue">
                    {/* File-text icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="result-subheading">Project Description</h3>
                    <p className="result-help-text">Core objective and technology foundation</p>
                  </div>
                </div>

                <p className="result-paragraph">
                  {po.coreObjective || "—"}
                </p>

                {/* Tech stack */}
                {(po.techStack?.frontend || po.techStack?.backend || po.techStack?.database || (po.techStack?.other?.length)) && (
                  <div className="techstack-wrap">
                    {po.techStack?.frontend && (
                      <span className="stack-chip">
                        <strong>Frontend:</strong> {po.techStack.frontend}
                      </span>
                    )}
                    {po.techStack?.backend && (
                      <span className="stack-chip">
                        <strong>Backend:</strong> {po.techStack.backend}
                      </span>
                    )}
                    {po.techStack?.database && (
                      <span className="stack-chip">
                        <strong>Database:</strong> {po.techStack.database}
                      </span>
                    )}
                    {(po.techStack?.other || []).map((o, i) => (
                      <span className="stack-chip" key={i}>
                        <strong>Other:</strong> {o}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Task Breakdown */}
              <section className="result-section">
                <div className="result-section-head">
                  <div className="result-step-icon result-step-icon-green">
                    {/* Checklist icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="9 11 12 14 22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="result-subheading">Task Breakdown</h3>
                    <p className="result-help-text">Weekly key activities extracted from the plan</p>
                  </div>
                </div>

                <div className="result-epic-stack">
                  {weeks.length === 0 && <p className="result-paragraph">—</p>}
                  {weeks.map((w, idx) => {
                    const tasks = parseWeeklyTasks(w.summary);
                    return (
                      <div className="result-epic-card" key={idx}>
                        <div className="result-epic-head">
                          <span className="result-epic-bullet" />
                          <h4 className="result-epic-title">
                            {w.weekLabel || `Week ${idx + 1}`}
                          </h4>
                        </div>

                        {tasks.length > 0 ? (
                          <ul className="result-bullet-list">
                            {tasks.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="result-paragraph">{firstSentence(w.summary)}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Timeline Estimate */}
              <section className="result-section">
                <div className="result-section-head">
                  <div className="result-step-icon result-step-icon-blue">
                    {/* Calendar icon */}
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="result-subheading">Timeline Estimate</h3>
                    <p className="result-help-text">High-level weekly schedule</p>
                  </div>
                </div>

                <div className="result-timeline">
                  {weeks.length === 0 && <p className="result-paragraph">—</p>}
                  {weeks.map((w, i) => (
                    <div className="result-milestone" key={i}>
                      <div className="result-milestone-dot" />
                      <div className="result-milestone-body">
                        <div className="result-milestone-top">
                          <span className="result-milestone-name">{w.weekLabel || `Week ${i + 1}`}</span>
                          <span className="result-status planned">planned</span>
                        </div>
                        <div className="result-milestone-date">{firstSentence(w.summary)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Scope & Deliverables */}
              <section className="result-section">
                <div className="result-section-head">
                  <div className="result-step-icon result-step-icon-purple">
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
                    <h3 className="result-subheading">Scope & Deliverables</h3>
                    <p className="result-help-text">Features in scope and the final output</p>
                  </div>
                </div>

                <div className="result-scope-grid">
                  <div>
                    <h4 className="result-subheading">Scope (Key Features)</h4>
                    {Array.isArray(po.keyFeatures) && po.keyFeatures.length > 0 ? (
                      <ul className="result-bullet-list">
                        {po.keyFeatures.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="result-paragraph">—</p>
                    )}
                  </div>

                  <div>
                    <h4 className="result-subheading">Deliverables & Resources</h4>
                    <ul className="result-bullet-list">
                      <li>{po.finalDeliverable || "—"}</li>
                      {(po.helpfulResources || []).map((r, i) => (
                        <li key={i}>{splitHelpfulItem(r)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Success guidance (optional) */}
              {(successTalkingPoints.length > 0 || successMethod !== "—") && (
                <section className="result-section">
                  <div className="result-section-head">
                    <div className="result-step-icon result-step-icon-green">
                      {/* Star-ish */}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="result-subheading">Success Notes</h3>
                      <p className="result-help-text">Recommended method: {successMethod}</p>
                    </div>
                  </div>
                  {successTalkingPoints.length > 0 ? (
                    <ul className="result-bullet-list">
                      {successTalkingPoints.map((tp, i) => (
                        <li key={i}>{tp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="result-paragraph">—</p>
                  )}
                </section>
              )}

              {/* Next steps (optional) */}
              {nextActions.length > 0 && (
                <section className="result-section">
                  <div className="result-section-head">
                    <div className="result-step-icon result-step-icon-blue">
                      {/* Arrow path icon */}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="result-subheading">Next Steps</h3>
                      <p className="result-help-text">Follow-up actions suggested by the model</p>
                    </div>
                  </div>
                  <ul className="result-bullet-list">
                    {nextActions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Actions: left (Start New) | right (Download if available, Export) */}
              <div className="result-actions">
                <div className="actions-left">
                  <a className="result-btn result-btn-success" href="/" title="Start a new application">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                    Start New Application
                  </a>
                </div>

                <div className="actions-right">
                  {downloadUrl && (
                    <a
                      className="result-btn result-btn-primary"
                      href={downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Download PDF"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <line x1="12" y1="3" x2="12" y2="15" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="5" y1="21" x2="19" y2="21" />
                      </svg>
                      Download PDF
                    </a>
                  )}

                  <button
                    type="button"
                    className="result-btn result-btn-secondary"
                    onClick={handleExportPdf}
                    title="Export this report to PDF"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="12" y1="12" x2="12" y2="18" />
                      <polyline points="9 15 12 18 15 15" />
                    </svg>
                    Export to PDF
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
