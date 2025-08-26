
import React from "react";
import "./ProjectDetails.css";

/** TEMP mock data (delete when wiring backend) */
const mockProjectDetails = {
  p1: {
    id: "p1",
    name: "Inventory Management System",
    internshipType: "Software Development",
    startDate: "2025-02-03",
    endDate: "2025-04-30",
    supervisor: "Dr. Karim J.",
    description:
      "A web-based inventory system that tracks stock levels, suppliers, and purchase orders, with role-based access and lightweight analytics.",
    hr: { name: "Sonia Hamdi", email: "sonia.hamdi@company.com" },
    trainees: [
      { id: "t1", name: "Ali Ben", email: "ali.ben@example.com", role: "Frontend Dev" },
      { id: "t2", name: "Maya Noor", email: "maya.noor@example.com", role: "Backend Dev" },
    ],
    tasks: [
      {
        id: "tsk1",
        title: "Set up repo & CI",
        description: "Initialize monorepo, add linting, prettier, and GitHub Actions.",
        assignedTo: "Ali Ben",
      },
      {
        id: "tsk2",
        title: "Design DB schema",
        description: "Create entities for items, suppliers, orders, and stock movement.",
        assignedTo: "Maya Noor",
      },
      {
        id: "tsk3",
        title: "Auth & RBAC",
        description: "Implement login + roles (admin, manager, viewer) and protect routes.",
        assignedTo: "Ali Ben",
      },
    ],
  },
};

const getInitials = (name) =>
  (name || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function ProjectDetails({ projectId = "p1", onBack = () => {} }) {
  const project = mockProjectDetails[projectId];

  if (!project) {
    return (
      <div className="project-details">
        <div className="pd-bg-pattern" aria-hidden="true" />
        <div className="pd-floating pd-f1" aria-hidden="true" />
        <div className="pd-floating pd-f2" aria-hidden="true" />
        <div className="pd-floating pd-f3" aria-hidden="true" />

        <div className="error-container">
          <div className="error-content">
            <h2 className="error-title">Project Not Found</h2>
            <button className="back-button back-button-card" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" style={{ marginRight: 6 }}>
                <polyline points="15,18 9,12 15,6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details">
      {/* Background: pattern + floating blobs */}
      <div className="pd-bg-pattern" aria-hidden="true" />
      <div className="pd-floating pd-f1" aria-hidden="true" />
      <div className="pd-floating pd-f2" aria-hidden="true" />
      <div className="pd-floating pd-f3" aria-hidden="true" />

      {/* Header */}
      <div className="details-header">
        <div className="details-header-container">
          <button onClick={onBack} className="back-button">
            <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
              <polyline points="15,18 9,12 15,6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            Back to Projects
          </button>

          <div className="header-content">
            <div className="header-info">
              <h1 className="project-title">{project.name}</h1>
              <span className="type-badge">{project.internshipType}</span>
              <p className="project-description">{project.description}</p>
            </div>

            {/* (kept layout; no overall progress per your request) */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-main-content">
        {/* Overview Grid: Timeline | Team | HR Contact */}
        <div className="overview-grid">
          {/* Timeline card */}
          <div className="overview-card">
            <div className="card-header-with-icon">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              Timeline
            </div>
            <div className="timeline-details">
              <div className="timeline-row">
                <span className="timeline-label">Start Date:</span>
                <span className="timeline-value">{formatDate(project.startDate)}</span>
              </div>
              <div className="timeline-row">
                <span className="timeline-label">End Date:</span>
                <span className="timeline-value">{formatDate(project.endDate)}</span>
              </div>
              <div className="timeline-row">
                <span className="timeline-label">Supervisor:</span>
                <span className="timeline-value">{project.supervisor}</span>
              </div>
            </div>
          </div>

          {/* Team card */}
          <div className="overview-card">
            <div className="card-header-with-icon">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </span>
              Team
            </div>
            <div className="team-details">
              <div>
                <div className="team-supervisor">Supervisor</div>
                <div className="team-supervisor-name">{project.supervisor}</div>
              </div>

              <div className="separator" />

              <div>
                <div className="team-trainees-label">Trainees</div>
                <div className="team-avatars">
                  {project.trainees.map((t) => (
                    <div key={t.id} className="team-avatar" title={t.name}>
                      <div className="team-avatar-text">{getInitials(t.name)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HR Contact card */}
          <div className="overview-card">
            <div className="card-header-with-icon">
              <span className="card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              HR Contact
            </div>
            <div className="hr-details">
              <div className="hr-row">
                <span className="hr-label">Name:</span>
                <span className="hr-value">{project.hr?.name || "—"}</span>
              </div>
              <div className="hr-row">
                <span className="hr-label">Email:</span>
                {project.hr?.email ? (
                  <a className="hr-mail" href={`mailto:${project.hr.email}`}>
                    {project.hr.email}
                  </a>
                ) : (
                  <span className="hr-value">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Description (explicit section above tasks) */}
        <div className="overview-card description-card">
          <div className="card-header-with-icon">
            <span className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            Project Description
          </div>
          <p className="project-description-block">{project.description || "—"}</p>
        </div>

        {/* Task Breakdown (no progress bars/status/deadlines) */}
        <div className="tasks-card">
          <div className="card-header-with-icon">
            <span className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7" />
              </svg>
            </span>
            Task Breakdown
          </div>

          <div className="tasks-list">
            {project.tasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-header">
                  <div className="task-content">
                    <div className="task-title-row">
                      <h4 className="task-title">{task.title}</h4>
                    </div>
                    <p className="task-description">{task.description}</p>
                  </div>
                </div>

                <div className="task-footer">
                  <div className="task-meta">
                    <div className="task-meta-item">
                      {/* Assigned-to only */}
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {task.assignedTo}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="team-members-card">
          <div className="card-header-with-icon">Team Members</div>
          <div className="team-members-grid">
            {project.trainees.map((trainee) => (
              <div key={trainee.id} className="team-member-card">
                <div className="team-member-header">
                  <div className="team-avatar">
                    <div className="team-avatar-text">{getInitials(trainee.name)}</div>
                  </div>
                  <div className="team-member-info">
                    <h4>{trainee.name}</h4>
                    <p className="team-member-role">{trainee.role}</p>
                  </div>
                </div>
                <div className="team-member-email">
                  <a href={`mailto:${trainee.email}`}>{trainee.email}</a>
                </div>
                <div>
                  <div className="team-member-tasks">Assigned Tasks</div>
                  <div className="team-member-task-count">
                    {project.tasks.filter((t) => t.assignedTo === trainee.name).length} tasks
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





