import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Report.css";
import axios from "axios";

export default function Report() {

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true); // default editable
  const location = useLocation();
  const navigate = useNavigate();
  const cvFilename = location.state?.cvFilename; 
  const [nameEmail, setNameEmail] = useState(null);  
  console.log("cvFilename:", cvFilename);
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
          setDraft(JSON.parse(JSON.stringify(navPlan)));
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
            setDraft(JSON.parse(JSON.stringify(parsed)));
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

  // Working source for view (draft in edit mode, saved report in preview)
  const working = editMode ? draft : report;

  // Map schema → local vars (safe fallbacks)
  const po = working?.projectOverview ?? {};
  const weeks = Array.isArray(working?.timeline) ? working.timeline : [];
  const successMethod = working?.success?.method ?? "";
  const successTalkingPoints = Array.isArray(working?.success?.talkingPoints)
    ? working.success.talkingPoints
    : [];
  const nextActions = Array.isArray(working?.nextSteps?.actions)
    ? working.nextSteps.actions
    : [];

  // Stats (only title + total duration)
  const stats = useMemo(() => {
    const totalWeeks = weeks.length
      ? `${weeks.length} week${weeks.length > 1 ? "s" : ""}`
      : "—";
    return {
      projectTitle: po.projectTitle ?? "",
      totalWeeks,
    };
  }, [po, weeks]);

  // Helpers
  const splitHelpfulItem = (s) => String(s || "").replace(/^\s*-\s*/, "").trim();
  const firstSentence = (text) => {
    const str = String(text || "").trim();
    if (!str) return "—";
    const idx = str.indexOf("\n");
    return idx > -1 ? str.slice(0, idx) : str;
  };

  // Editing handlers (safe update helpers)
  const updatePO = (patch) => {
    setDraft((d) => ({
      ...d,
      projectOverview: { ...(d?.projectOverview || {}), ...patch },
    }));
  };

  const updateTech = (field, value) => {
    setDraft((d) => ({
      ...d,
      projectOverview: {
        ...(d?.projectOverview || {}),
        techStack: { ...(d?.projectOverview?.techStack || {}), [field]: value },
      },
    }));
  };

  const updateKeyFeature = (idx, value) => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.keyFeatures)
        ? [...d.projectOverview.keyFeatures]
        : [];
      arr[idx] = value;
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), keyFeatures: arr },
      };
    });
  };

  const addKeyFeature = () => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.keyFeatures)
        ? [...d.projectOverview.keyFeatures]
        : [];
      arr.push("");
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), keyFeatures: arr },
      };
    });
  };

  const removeKeyFeature = (idx) => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.keyFeatures)
        ? [...d.projectOverview.keyFeatures]
        : [];
      arr.splice(idx, 1);
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), keyFeatures: arr },
      };
    });
  };

  const updateResource = (idx, value) => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.helpfulResources)
        ? [...d.projectOverview.helpfulResources]
        : [];
      arr[idx] = value;
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), helpfulResources: arr },
      };
    });
  };

  const addResource = () => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.helpfulResources)
        ? [...d.projectOverview.helpfulResources]
        : [];
      arr.push("");
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), helpfulResources: arr },
      };
    });
  };

  const removeResource = (idx) => {
    setDraft((d) => {
      const arr = Array.isArray(d?.projectOverview?.helpfulResources)
        ? [...d.projectOverview.helpfulResources]
        : [];
      arr.splice(idx, 1);
      return {
        ...d,
        projectOverview: { ...(d?.projectOverview || {}), helpfulResources: arr },
      };
    });
  };

  const updateWeek = (idx, patch) => {
    setDraft((d) => {
      const arr = Array.isArray(d?.timeline) ? [...d.timeline] : [];
      arr[idx] = { ...(arr[idx] || {}), ...patch };
      return { ...d, timeline: arr };
    });
  };

  const updateSuccessMethod = (value) => {
    setDraft((d) => ({
      ...d,
      success: { ...(d?.success || {}), method: value },
    }));
  };

  const updateSuccessTalkingPoints = (value) => {
    const lines = String(value || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setDraft((d) => ({
      ...d,
      success: { ...(d?.success || {}), talkingPoints: lines },
    }));
  };

  const updateNextActions = (value) => {
    const lines = String(value || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    setDraft((d) => ({
      ...d,
      nextSteps: { ...(d?.nextSteps || {}), actions: lines },
    }));
  };

  const applyEdits = () => {
    setReport(draft);
    try {
      sessionStorage.setItem("projectPlan", JSON.stringify(draft));
    } catch {}
  };

  const downloadUrl = working?.downloadUrl || null;

  const handleExportPdf = () => {
    window.print();
  };

  const onClickGoToProjects = () => {
    if (!cvFilename) {
      console.error("cvFilename is missing!");
      return;
    }
    navigate("/Projects-Overview", { state: { cvFilename } });
  };


  const fetchNameEmail = async () => {
    try {
      const response = await axios.get("/api/project/name-email/get", {
        params: { cvFilename },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    setNameEmail(response.data);
    } catch (err) {
      console.error("Failed to fetch name/email", err);
    } finally {
      setLoading(false);
    }
};

useEffect(()=>{
  fetchNameEmail();
},[])


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
            AI-generated internship report (editable before you export or use it).
          </p>
        </div>

        {/* Card */}
        <div className="result-card">
          {/* Top */}
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
                <p>Edit content, then apply and export</p>
              </div>
            </div>

            <div className="edit-toolbar">
              <button
                type="button"
                className={`result-btn ${editMode ? "result-btn-secondary" : "result-btn-primary"}`}
                onClick={() => setEditMode((v) => !v)}
                title="Toggle Edit/Preview"
              >
                {editMode ? "Switch to Preview" : "Switch to Edit"}
              </button>
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
          {!loading && !error && working && (
            <>
              {/* Stats Grid (ONLY title + total duration) */}
              <div className="result-stats-grid">
                <div className="result-stat-box">
                  <span className="result-stat-label">Project Title</span>
                  {!editMode ? (
                    <span className="result-stat-value">{stats.projectTitle || "—"}</span>
                  ) : (
                    <input
                      type="text"
                      className="result-input"
                      value={po.projectTitle ?? ""}
                      onChange={(e) => updatePO({ projectTitle: e.target.value })}
                      placeholder="Enter a project title"
                    />
                  )}
                </div>

                <div className="result-stat-box">
                  <span className="result-stat-label">Total Duration</span>
                  <span className="result-stat-value">{stats.totalWeeks}</span>
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

                {!editMode ? (
                  <>
                    <p className="result-paragraph">{po.coreObjective || "—"}</p>

                    {(po.techStack?.frontend ||
                      po.techStack?.backend ||
                      po.techStack?.database ||
                      (po.techStack?.other || []).length > 0) && (
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
                  </>
                ) : (
                  <div className="edit-grid">
                    <label className="edit-field">
                      <span className="edit-label">Core Objective</span>
                      <textarea
                        className="result-textarea"
                        rows={4}
                        value={po.coreObjective ?? ""}
                        onChange={(e) => updatePO({ coreObjective: e.target.value })}
                        placeholder="Describe the main goal of the project"
                      />
                    </label>

                    <div className="edit-subgrid">
                      <label className="edit-field">
                        <span className="edit-label">Frontend</span>
                        <input
                          type="text"
                          className="result-input"
                          value={po?.techStack?.frontend ?? ""}
                          onChange={(e) => updateTech("frontend", e.target.value)}
                          placeholder="e.g., React"
                        />
                      </label>
                      <label className="edit-field">
                        <span className="edit-label">Backend</span>
                        <input
                          type="text"
                          className="result-input"
                          value={po?.techStack?.backend ?? ""}
                          onChange={(e) => updateTech("backend", e.target.value)}
                          placeholder="e.g., Node.js/Express"
                        />
                      </label>
                      <label className="edit-field">
                        <span className="edit-label">Database</span>
                        <input
                          type="text"
                          className="result-input"
                          value={po?.techStack?.database ?? ""}
                          onChange={(e) => updateTech("database", e.target.value)}
                          placeholder="e.g., MongoDB"
                        />
                      </label>
                      <label className="edit-field">
                        <span className="edit-label">Other (comma separated)</span>
                        <input
                          type="text"
                          className="result-input"
                          value={(po?.techStack?.other || []).join(", ")}
                          onChange={(e) =>
                            updateTech(
                              "other",
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                            )
                          }
                          placeholder="e.g., AWS S3, Redis"
                        />
                      </label>
                    </div>
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
                    <p className="result-help-text">
                      {editMode
                        ? "Edit weekly labels and summaries. Use - lines for bullets if you like."
                        : "Weekly key activities extracted from the plan"}
                    </p>
                  </div>
                </div>

                <div className="result-epic-stack">
                  {weeks.length === 0 && (
                    <p className="result-paragraph">—</p>
                  )}

                  {weeks.map((w, idx) => {
                    const tasks = String(w.summary || "")
                      .split("\n")
                      .map((l) => l.trim())
                      .filter((l) => l.startsWith("- "))
                      .map((l) => l.replace(/^\s*-\s*/, "").trim());

                    return (
                      <div className="result-epic-card" key={idx}>
                        {!editMode ? (
                          <>
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
                          </>
                        ) : (
                          <div className="edit-week">
                            <div className="edit-week-row">
                              <input
                                type="text"
                                className="result-input"
                                value={w.weekLabel ?? `Week ${idx + 1}`}
                                onChange={(e) => updateWeek(idx, { weekLabel: e.target.value })}
                              />
                            </div>
                            <textarea
                              className="result-textarea"
                              rows={4}
                              value={w.summary ?? ""}
                              onChange={(e) => updateWeek(idx, { summary: e.target.value })}
                              placeholder="Describe the main goal and key activities for this week"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
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

                {!editMode ? (
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
                ) : (
                  <div className="edit-grid">
                    <div className="list-editor">
                      <div className="list-editor-head">
                        <h4 className="result-subheading">Key Features</h4>
                        <button className="small-btn" type="button" onClick={addKeyFeature}>
                          + Add
                        </button>
                      </div>
                      <div className="list-editor-body">
                        {(po.keyFeatures || []).map((f, i) => (
                          <div className="list-row" key={i}>
                            <input
                              type="text"
                              className="result-input"
                              value={f}
                              onChange={(e) => updateKeyFeature(i, e.target.value)}
                              placeholder={`Feature ${i + 1}`}
                            />
                            <button
                              type="button"
                              className="small-btn danger"
                              onClick={() => removeKeyFeature(i)}
                              aria-label="Remove feature"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!po.keyFeatures || po.keyFeatures.length === 0) && (
                          <p className="result-help-text">No features yet.</p>
                        )}
                      </div>
                    </div>

                    <label className="edit-field">
                      <span className="edit-label">Final Deliverable</span>
                      <input
                        type="text"
                        className="result-input"
                        value={po.finalDeliverable ?? ""}
                        onChange={(e) => updatePO({ finalDeliverable: e.target.value })}
                        placeholder="e.g., Public GitHub repo, live URL, and README.md"
                      />
                    </label>

                    <div className="list-editor">
                      <div className="list-editor-head">
                        <h4 className="result-subheading">Helpful Resources</h4>
                        <button className="small-btn" type="button" onClick={addResource}>
                          + Add
                        </button>
                      </div>
                      <div className="list-editor-body">
                        {(po.helpfulResources || []).map((r, i) => (
                          <div className="list-row" key={i}>
                            <input
                              type="text"
                              className="result-input"
                              value={r}
                              onChange={(e) => updateResource(i, e.target.value)}
                              placeholder={`Resource ${i + 1}`}
                            />
                            <button
                              type="button"
                              className="small-btn danger"
                              onClick={() => removeResource(i)}
                              aria-label="Remove resource"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {(!po.helpfulResources || po.helpfulResources.length === 0) && (
                          <p className="result-help-text">No resources yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Success guidance (editable) */}
              {(successTalkingPoints.length > 0 || successMethod || editMode) && (
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
                      {!editMode ? (
                        <p className="result-help-text">Recommended method: {successMethod || "—"}</p>
                      ) : (
                        <div className="edit-inline">
                          <span className="edit-label">Method</span>
                          <input
                            type="text"
                            className="result-input"
                            value={successMethod}
                            onChange={(e) => updateSuccessMethod(e.target.value)}
                            placeholder="e.g., STAR"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {!editMode ? (
                    successTalkingPoints.length > 0 ? (
                      <ul className="result-bullet-list">
                        {successTalkingPoints.map((tp, i) => (
                          <li key={i}>{tp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="result-paragraph">—</p>
                    )
                  ) : (
                    <textarea
                      className="result-textarea"
                      rows={4}
                      value={successTalkingPoints.join("\n")}
                      onChange={(e) => updateSuccessTalkingPoints(e.target.value)}
                      placeholder="One talking point per line"
                    />
                  )}
                </section>
              )}

              {/* Next steps (editable) */}
              {(nextActions.length > 0 || editMode) && (
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
                      <p className="result-help-text">
                        {editMode ? "Edit one action per line" : "Follow-up actions suggested by the model"}
                      </p>
                    </div>
                  </div>

                  {!editMode ? (
                    <ul className="result-bullet-list">
                      {nextActions.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <textarea
                      className="result-textarea"
                      rows={4}
                      value={nextActions.join("\n")}
                      onChange={(e) => updateNextActions(e.target.value)}
                      placeholder="Write each action on a new line"
                    />
                  )}
                </section>
              )}

              {/* Actions */}
              <div className="result-actions">
                <div className="actions-left">
                  <button className="result-btn result-btn-success"  title="Start a new application" onClick={onClickGoToProjects}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                    Start New Application
                  </button>
                </div>

                <div className="actions-right">
                  <button
                    type="button"
                    className="result-btn result-btn-primary"
                    onClick={applyEdits}
                    title="Apply edits and save to session"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Apply Edits
                  </button>

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





