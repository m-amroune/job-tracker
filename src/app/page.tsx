"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { JobApplication, JobStatus } from "@/types/job";
import JobRow from "@/components/JobRow";

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

  // sort direction for date column
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Load jobs on first render
  useEffect(() => {
    const raw = loadJobs();

    // If no data in storage, initialize with a new default job
    if (!Array.isArray(raw) || raw.length === 0) {
      const defaultJobs: JobApplication[] = [
        {
          id: crypto.randomUUID(),
          company: "Compagny1",
          position: "Frontend Developer",
          status: "todo",
          createdAt: new Date("2024-01-01").toISOString(),
        },
        {
          id: crypto.randomUUID(),
          company: "Compagny2",
          position: "Backend Engineer",
          status: "applied",
          createdAt: new Date("2025-01-02").toISOString(),
        },
        {
          id: crypto.randomUUID(),
          company: "Compagny3",
          position: "Fullstack Developer",
          status: "interview",
          createdAt: new Date("2026-03-03").toISOString(),
        },
      ];

      setJobs(defaultJobs);
      saveJobs(defaultJobs);
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

  // sort jobs by date (asc or desc)
  const sortedJobs = [...jobs].sort((a, b) => {
    const da = new Date(a.createdAt).getTime();
    const db = new Date(b.createdAt).getTime();

    return sortDir === "desc" ? db - da : da - db;
  });

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
              <th
                onClick={() => setSortDir(sortDir === "desc" ? "asc" : "desc")}
                style={{ cursor: "pointer" }}
              >
                Date {sortDir === "desc" ? "▼" : "▲"}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                editingId={editingId}
                setEditingId={setEditingId}
                updateJob={updateJob}
                cycleStatus={cycleStatus}
                resetStatus={resetStatus}
                deleteJob={deleteJob}
              />
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
