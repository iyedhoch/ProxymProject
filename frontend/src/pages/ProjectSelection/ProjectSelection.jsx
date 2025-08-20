import React, { useEffect, useState } from "react";
import "./ProjectSelection.css";

function ProjectSelection() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch 3 projects from backend on mount
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://localhost:8002/api/projects");
        const data = await response.json(); // expecting an array like [{name: "Project A"}, ...]
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    }
    fetchProjects();
  }, []);

  const handleSelect = (projectName) => {
    setSelectedProject(projectName);
  };

  const handleSubmit = async () => {
    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8002/api/projects/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedProject }),
      });

      if (response.ok) {
        const result = await response.text();
        alert(`Project "${selectedProject}" submitted successfully!`);
      } else {
        const error = await response.text();
        alert("Submission failed: " + error);
      }
    } catch (err) {
      console.error("Error submitting project:", err);
      alert("Error submitting project");
    }
  };

  return (
    <div className="project-selection-container">
      <h1>Select Your Internship Project</h1>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`project-card ${selectedProject === project.name ? "selected" : ""}`}
            onClick={() => handleSelect(project.name)}
          >
            <p>{project.name}</p>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={!selectedProject}>
        Submit Project
      </button>
    </div>
  );
}

export default ProjectSelection;
