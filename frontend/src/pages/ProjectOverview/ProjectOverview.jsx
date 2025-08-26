import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProjectOverview.css";

const mockProjectsList = [
  {
    id: "p1",
    name: "Inventory Management System",
    internshipType: "Software Development",
    startDate: "2025-02-03",
    endDate: "2025-04-30",
    hr: { name: "Sonia Hamdi", email: "sonia.hamdi@company.com" },
    trainees: [
      { name: "Ali Ben", email: "ali.ben@example.com" },
      { name: "Maya Noor", email: "maya.noor@example.com" },
    ],
  },
  {
    id: "p2",
    name: "Helpdesk Chatbot",
    internshipType: "AI / NLP",
    startDate: "2025-03-01",
    endDate: "2025-05-15",
    hr: { name: "Hatem Messaoud", email: "hatem.messaoud@company.com" },
    trainees: [
      { name: "Lea Saidi", email: "lea.saidi@example.com" },
      { name: "Yassine K.", email: "yassine.k@example.com" },
    ],
  },
  {
    id: "p3",
    name: "Mobile Expense Tracker",
    internshipType: "Mobile",
    startDate: "2025-01-15",
    endDate: "2025-03-20",
    hr: { name: "Sonia Hamdi", email: "sonia.hamdi@company.com" },
    trainees: [{ name: "Imen Tr.", email: "imen.tr@example.com" }],
  },
];

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function ProjectList({
  onOpenProject,
  onStartNewApplication,
  projects = mockProjectsList,
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = [
        p.name,
        p.internshipType,
        p.hr?.name,
        p.hr?.email,
        ...(p.trainees || []).map((t) => t.name),
        ...(p.trainees || []).map((t) => t.email),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  const openProject = (id) => {
    if (onOpenProject) return onOpenProject(id);
    navigate(`/projects/${id}`);
  };

  const startNew = () => {
    if (onStartNewApplication) return onStartNewApplication();
    navigate("/"); // your “Test.jsx” flow
  };

  return (
    <div className="pl-root">
      <div className="pl-bg" />
      <div className="pl-float pl-float-1" />
      <div className="pl-float pl-float-2" />
      <div className="pl-float pl-float-3" />

      <div className="pl-container">
        <div className="pl-header">
          <div className="pl-logo">
            <img src="/logoproxym.png" alt="logo" width="40" height="40" />
          </div>
          <h1 className="pl-hero">Projects</h1>
          <p className="pl-sub">Browse active and planned internship projects.</p>
        </div>

        <div className="pl-card">
          {/* Search bar */}
          <div className="pl-search">
            <div className="pl-search-wrap">
              <svg viewBox="0 0 24 24" className="pl-icon" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="pl-input"
                type="text"
                placeholder="Search projects, trainees, HR…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="pl-table-wrap">
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Internship Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>HR</th>
                  <th>Trainees</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="pl-empty">No projects match “{query}”.</td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <button className="pl-link" onClick={() => openProject(p.id)} title="Open project">
                        {p.name}
                      </button>
                    </td>
                    <td>{p.internshipType}</td>
                    <td>{fmt(p.startDate)}</td>
                    <td>{fmt(p.endDate)}</td>
                    <td>
                      <div className="pl-hr">
                        <div className="pl-hr-name">{p.hr?.name || "—"}</div>
                        {p.hr?.email ? (
                          <a className="pl-hr-mail" href={`mailto:${p.hr.email}`}>{p.hr.email}</a>
                        ) : (
                          <span className="pl-hr-mail">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="pl-trainees">
                        {(p.trainees || []).map((t, i) => (
                          <span key={i} className="pl-trainee">
                            {t.name}
                            <span className="pl-email"> — {t.email}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="pl-cta-row">
            <button className="pl-btn pl-btn-primary" onClick={startNew}>
              <svg viewBox="0 0 24 24" className="pl-icon" aria-hidden="true">
                <polyline points="9,18 15,12 9,6" />
              </svg>
              Start New Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

