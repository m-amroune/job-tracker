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

export default function Page() {
  // Stored job applications (hydrated from localStorage)
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Controlled inputs for creation form
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  const [offerUrl, setOfferUrl] = useState("");

  // Id of the row currently being edited (null = no edit mode)
  const [editingId, setEditingId] = useState<string | null>(null);

  // allowed keys for sorting
  type SortKey = "company" | "position" | "status" | "createdAt";

  // sort settings for table columns
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    dir: "asc" | "desc";
  }>({
    key: "createdAt",
    dir: "desc",
  });

  // search query for filtering jobs
  const [search, setSearch] = useState("");

  // filter by status
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");

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
          offerUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        {
          id: crypto.randomUUID(),
          company: "Compagny2",
          position: "Backend Engineer",
          status: "applied",
          createdAt: new Date("2025-01-02").toISOString(),
          offerUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        },
        {
          id: crypto.randomUUID(),
          company: "Compagny3",
          position: "Fullstack Developer",
          status: "interview",
          createdAt: new Date("2026-03-03").toISOString(),
          offerUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
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
      offerUrl: offerUrl.trim() || undefined,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [...jobs, newJob];

    setJobs(updatedJobs);
    saveJobs(updatedJobs);

    setCompany("");
    setPosition("");
    setOfferUrl("");
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
  function updateJob(
    id: string,
    field: "company" | "position" | "offerUrl",
    value: string,
  ) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? ({ ...job, [field]: value } as JobApplication) : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // update sort settings when clicking a column
  function handleSort(key: SortKey) {
    setSortConfig((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  }

  // filter by search (company + position) and status

  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();

    const matchesSearch =
      job.company.toLowerCase().includes(q) ||
      job.position.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ? true : job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // sort jobs by selected column
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.dir === "asc" ? 1 : -1;

    if (key === "createdAt") {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return (da - db) * dir;
    }

    // string comparison for company, position, status
    return a[key].localeCompare(b[key]) * dir;
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

        <input
          type="text"
          placeholder="Offer URL"
          value={offerUrl}
          onChange={(e) => setOfferUrl(e.target.value)}
        />

        <button onClick={addJob}>Add</button>
      </div>

      <input
        type="text"
        placeholder="Search company or position..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-2 py-1 rounded mb-4 w-full"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as JobStatus | "all")}
        style={{
          marginTop: "0.5rem",
          marginBottom: "1rem",
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      >
        <option value="all">All statuses</option>
        <option value="todo">Todo</option>
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="rejected">Rejected</option>
      </select>
      <div
        className="offers-counter"
        style={{
          marginTop: "1.5rem",
          marginBottom: "0.8rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "1rem",
          fontWeight: 600,
          color: "#222",
        }}
      >
        <span>Total applications:</span>
        <span
          style={{
            background: "#e5e7eb",
            padding: "4px 12px",
            borderRadius: "6px",
            fontWeight: 700,
          }}
        >
          {jobs.length}
        </span>
      </div>

      {sortedJobs.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("company")}
                style={{ cursor: "pointer" }}
              >
                Company{" "}
                {sortConfig.key === "company"
                  ? sortConfig.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                onClick={() => handleSort("position")}
                style={{ cursor: "pointer" }}
              >
                Position{" "}
                {sortConfig.key === "position"
                  ? sortConfig.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                onClick={() => handleSort("status")}
                style={{ cursor: "pointer" }}
              >
                Status{" "}
                {sortConfig.key === "status"
                  ? sortConfig.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>

              <th
                onClick={() => handleSort("createdAt")}
                style={{ cursor: "pointer" }}
              >
                Date{" "}
                {sortConfig.key === "createdAt"
                  ? sortConfig.dir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th>Details</th>

              <th>Actions</th>
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
