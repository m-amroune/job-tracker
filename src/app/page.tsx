"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { JobApplication, JobStatus } from "@/types/job";

// Ordered list of job statuses (business workflow)
const STATUS_ORDER: readonly JobStatus[] = [
  "todo",
  "applied",
  "interview",
  "rejected",
];

// Move to the next status (rejected is terminal)
function getNextStatus(current: JobStatus): JobStatus {
  const index = STATUS_ORDER.indexOf(current);

  if (index === STATUS_ORDER.length - 1) {
    return current; // stay on rejected
  }

  return STATUS_ORDER[index + 1];
}

// Generate a fresh default job entry (avoids creating a static ID at module load)
function createDefaultJob(): JobApplication {
  return {
    id: crypto.randomUUID(),
    company: "Example company",
    position: "Frontend Developer",
    status: "todo",
    createdAt: new Date().toISOString(),
  };
}

export default function Page() {
  // Stored job applications (hydrated from localStorage)
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Controlled inputs for creation form
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  // Id of the row currently being edited (null = no edit mode)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Load jobs on first render
  useEffect(() => {
    const raw = loadJobs();

    // If no data in storage, initialize with a new default job
    if (!Array.isArray(raw) || raw.length === 0) {
      const defaultJob = createDefaultJob();
      setJobs([defaultJob]);
      saveJobs([defaultJob]);
      return;
    }

    // Normalize loaded items so status is typed as JobStatus
    const normalized: JobApplication[] = raw.map((item) => {
      // treat item as a generic record and validate each field
      const rec = item as Record<string, unknown>;

      const id =
        typeof rec.id === "string" && rec.id.length > 0
          ? rec.id
          : crypto.randomUUID();

      const company = typeof rec.company === "string" ? rec.company : "";
      const position = typeof rec.position === "string" ? rec.position : "";

      // ensure status is one of the allowed JobStatus values
      const statusCandidate = typeof rec.status === "string" ? rec.status : "";
      const status: JobStatus = STATUS_ORDER.includes(
        statusCandidate as JobStatus,
      )
        ? (statusCandidate as JobStatus)
        : "todo";

      const createdAt =
        typeof rec.createdAt === "string"
          ? rec.createdAt
          : new Date().toISOString();

      const offerUrl =
        typeof rec.offerUrl === "string" ? rec.offerUrl : undefined;

      const notes = typeof rec.notes === "string" ? rec.notes : undefined;

      return {
        id,
        company,
        position,
        status,
        createdAt,
        offerUrl,
        notes,
      } as JobApplication;
    });

    setJobs(normalized);
  }, []);

  // Create a new job entry from form inputs and persist
  function addJob() {
    if (!company.trim() || !position.trim()) return;

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: company.trim(),
      position: position.trim(),
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [...jobs, newJob];

    setJobs(updatedJobs);
    saveJobs(updatedJobs);

    setCompany("");
    setPosition("");
  }

  // Move job to next status in workflow and persist
  function cycleStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? ({ ...job, status: getNextStatus(job.status) } as JobApplication)
        : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Reset job status back to "todo"
  function resetStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? ({ ...job, status: "todo" } as JobApplication) : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Remove job from list and persist
  function deleteJob(id: string) {
    const updatedJobs = jobs.filter((job) => job.id !== id);

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Update a single field while editing a row
  function updateJob(id: string, field: "company" | "position", value: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? ({ ...job, [field]: value } as JobApplication) : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  return (
    <main className="conteneur">
      <h1 className="main-title">Job tracker</h1>

      <div
        className="form-row"
        style={{ marginTop: "1rem", marginBottom: "1rem" }}
      >
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
                <td>
                  {editingId === job.id ? (
                    <input
                      value={job.company}
                      onChange={(e) =>
                        updateJob(job.id, "company", e.target.value)
                      }
                    />
                  ) : (
                    job.company
                  )}
                </td>

                <td>
                  {editingId === job.id ? (
                    <input
                      value={job.position}
                      onChange={(e) =>
                        updateJob(job.id, "position", e.target.value)
                      }
                    />
                  ) : (
                    job.position
                  )}
                </td>

                <td className="status-cell">
                  <span onClick={() => cycleStatus(job.id)}>{job.status}</span>
                </td>

                <td className="actions">
                  {editingId === job.id ? (
                    <button onClick={() => setEditingId(null)}>Save</button>
                  ) : (
                    <button onClick={() => setEditingId(job.id)}>Edit</button>
                  )}

                  <button onClick={() => resetStatus(job.id)}>Reset</button>

                  <button
                    className="danger"
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
