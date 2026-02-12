"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { JobApplication, JobStatus } from "@/types/job";

// Ordered list of job statuses (business rule)
const STATUS_ORDER = ["todo", "applied", "interview", "rejected"] as const;

// Return the next status in the cycle
function getNextStatus(current: JobStatus): JobStatus {
  const index = STATUS_ORDER.indexOf(current);
  const nextIndex = (index + 1) % STATUS_ORDER.length;
  return STATUS_ORDER[nextIndex];
}

export default function Page() {
  // Job applications state (client-side data)
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  // Load jobs from localStorage after mount
  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  // Add a new job application
  // Update state and localStorage
  function addJob() {
    if (!company.trim() || !position.trim()) return;

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: company.trim(),
      position: position.trim(),
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    // Create a new array (immutability)
    const updatedJobs = [...jobs, newJob];

    setJobs(updatedJobs);
    saveJobs(updatedJobs);

    setCompany("");
    setPosition("");
  }

  // Cycle the status of a job when the list item is clicked
  // Update state and localStorage
  function cycleStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, status: getNextStatus(job.status) } : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Delete a job application by id
  // Update state and localStorage
  function deleteJob(id: string) {
    const updatedJobs = jobs.filter((job) => job.id !== id);

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  return (
    <main>
      <h1>Job tracker</h1>

      <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <button onClick={addJob}>Add</button>
      </div>

      {jobs.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.company}</td>
                <td>{job.position}</td>
                <td>
                  <span onClick={() => cycleStatus(job.id)}>{job.status}</span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("Delete this application?")) {
                        deleteJob(job.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
