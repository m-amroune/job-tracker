"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { getFollowUpStatus } from "@/lib/followUp";
import { JobApplication, JobStatus } from "@/types/job";
import JobTable from "@/components/JobTable";
import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Link2,
  Plus,
  Search,
  BarChart3,
} from "lucide-react";

// Defines the order used when cycling through application statuses.
const STATUS_ORDER: readonly JobStatus[] = [
  "todo",
  "applied",
  "interview",
  "rejected",
];

// Returns the next status in the workflow. Rejected is the final state.
function getNextStatus(current: JobStatus): JobStatus {
  const index = STATUS_ORDER.indexOf(current);

  if (index === STATUS_ORDER.length - 1) {
    return current;
  }

  return STATUS_ORDER[index + 1];
}

// Returns a local YYYY-MM-DD date relative to today.
function getRelativeDate(offsetDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

// Returns a creation date relative to today.
function getRelativeCreatedAt(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString();
}

export default function Page() {
  // Main application state, hydrated from localStorage on first render.
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Controlled inputs for the creation form.
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [offerUrl, setOfferUrl] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  // Tracks which application is currently in edit mode.
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [followUpFilter, setFollowUpFilter] = useState<
    "all" | "upcoming" | "today" | "overdue" | "no-date"
  >("all");

  // Load stored applications once when the page is mounted.
  useEffect(() => {
    const raw = loadJobs();

    // Seed demo applications when localStorage does not contain any jobs.
    if (!Array.isArray(raw) || raw.length === 0) {
     const DEFAULT_JOBS: JobApplication[] = [
  {
    id: crypto.randomUUID(),
    company: "Nova Digital",
    position: "Frontend Developer",
    status: "todo",
    createdAt: getRelativeCreatedAt(2),
    followUpDate: getRelativeDate(7),
    offerUrl: "https://example.com/jobs/frontend-developer",
  },
  {
    id: crypto.randomUUID(),
    company: "Dream startup",
    position: "React Developer",
    status: "applied",
    createdAt: getRelativeCreatedAt(5),
    followUpDate: getRelativeDate(0),
    notes: "Application sent after speaking with the recruiter.",
  },
  {
    id: crypto.randomUUID(),
    company: "Tech agency",
    position: "Next.js Developer",
    status: "interview",
    createdAt: getRelativeCreatedAt(9),
    followUpDate: getRelativeDate(35),
    offerUrl: "https://example.com/jobs/nextjs-developer",
    notes: "Technical interview scheduled.",
  },
  {
    id: crypto.randomUUID(),
    company: "Bright Labs",
    position: "React Developer",
    status: "applied",
    createdAt: getRelativeCreatedAt(12),
    followUpDate: getRelativeDate(-4),
    offerUrl: "https://example.com/jobs/react-developer",
    notes: "Follow up with the hiring manager.",
  },
  {
    id: crypto.randomUUID(),
    company: "Orbit Systems",
    position: "Frontend Engineer",
    status: "applied",
    createdAt: getRelativeCreatedAt(7),
    followUpDate: getRelativeDate(4),
  },
  {
    id: crypto.randomUUID(),
    company: "Northstar Tech",
    position: "TypeScript Developer",
    status: "interview",
    createdAt: getRelativeCreatedAt(14),
    followUpDate: getRelativeDate(21),
    offerUrl: "https://example.com/jobs/typescript-developer",
    notes: "Prepare examples of recent React projects.",
  },
  {
    id: crypto.randomUUID(),
    company: "PixelForge",
    position: "UI Developer",
    status: "todo",
    createdAt: getRelativeCreatedAt(1),
    offerUrl: "https://example.com/jobs/ui-developer",
  },
  {
    id: crypto.randomUUID(),
    company: "CloudNest",
    position: "React Engineer",
    status: "rejected",
    createdAt: getRelativeCreatedAt(24),
    notes: "Position filled internally.",
  },
  {
    id: crypto.randomUUID(),
    company: "BluePeak",
    position: "React TypeScript Developer",
    status: "applied",
    createdAt: getRelativeCreatedAt(10),
    followUpDate: getRelativeDate(10),
    offerUrl: "https://example.com/jobs/react-typescript",
  },
  {
    id: crypto.randomUUID(),
    company: "Horizon Labs",
    position: "Web Developer",
    status: "rejected",
    createdAt: getRelativeCreatedAt(30),
    notes: "Keep the company in mind for future openings.",
  },
];

      setJobs(DEFAULT_JOBS);
      saveJobs(DEFAULT_JOBS);
      return;
    }

    // Normalize stored data before using it as JobApplication objects.
    const normalized: JobApplication[] = raw.map((item) => {
      const rec = item as Record<string, unknown>;

      const id =
        typeof rec.id === "string" && rec.id.length > 0
          ? rec.id
          : crypto.randomUUID();

      const company = typeof rec.company === "string" ? rec.company : "";
      const position = typeof rec.position === "string" ? rec.position : "";

      // Keep only known status values and fall back to "todo" if invalid.
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

      // Optional fields stay compatible with older localStorage data.
      const followUpDate =
        typeof rec.followUpDate === "string" ? rec.followUpDate : undefined;

      const notes = typeof rec.notes === "string" ? rec.notes : undefined;

      return {
        id,
        company,
        position,
        status,
        createdAt,
        offerUrl,
        notes,
        followUpDate,
      } as JobApplication;
    });

    setJobs(normalized);
  }, []);

  // Create a new application and persist the updated list.
  function addJob() {
    if (!company.trim() || !position.trim()) return;

    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: company.trim(),
      position: position.trim(),
      offerUrl: offerUrl.trim() || undefined,
      followUpDate: followUpDate || undefined,
      notes: notes.trim() || undefined,
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    const updatedJobs = [...jobs, newJob];

    setJobs(updatedJobs);
    saveJobs(updatedJobs);

    setCompany("");
    setPosition("");
    setOfferUrl("");
    setFollowUpDate("");
    setNotes("");
  }

  // Move an application to the next status and persist the change.
  function cycleStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id
        ? ({ ...job, status: getNextStatus(job.status) } as JobApplication)
        : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Reset an application status back to "todo".
  function resetStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? ({ ...job, status: "todo" } as JobApplication) : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Remove an application and persist the updated list.
  function deleteJob(id: string) {
    const updatedJobs = jobs.filter((job) => job.id !== id);

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Update one editable field without replacing the whole application.
  function updateJob(
    id: string,
    field: "company" | "position" | "offerUrl" | "followUpDate" | "notes",
    value: string,
  ) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? ({ ...job, [field]: value } as JobApplication) : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }
  // Build today's local date to compare follow-up dates.
  const now = new Date();

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  // Apply search, status and follow-up filters together.
  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();

    const matchesSearch =
      job.company.toLowerCase().includes(q) ||
      job.position.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" ? true : job.status === statusFilter;

    let matchesFollowUp = true;

    if (followUpFilter === "no-date") {
      matchesFollowUp = !job.followUpDate;
    } else if (followUpFilter !== "all") {
      matchesFollowUp =
        !!job.followUpDate &&
        getFollowUpStatus(job.followUpDate, today) === followUpFilter;
    }

    return matchesSearch && matchesStatus && matchesFollowUp;
  });

  return (
    <main className="conteneur">
      <header className="page-header">
        <h1 className="main-title">Job Tracker</h1>
      </header>

      <h2 className="section-title">New application</h2>

      <form
        className="form-row"
        onSubmit={(e) => {
          e.preventDefault();
          addJob();
        }}
      >
        <div className="form-field">
          <label htmlFor="company">Company</label>

          <div className="input-with-icon">
            <Building2 size={17} aria-hidden="true" />
            <input
              id="company"
              type="text"
              aria-label="Company"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="position">Position</label>

          <div className="input-with-icon">
            <BriefcaseBusiness size={17} aria-hidden="true" />
            <input
              id="position"
              type="text"
              aria-label="Position"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="offer-url">Offer URL</label>

          <div className="input-with-icon">
            <Link2 size={17} aria-hidden="true" />
            <input
              id="offer-url"
              type="url"
              aria-label="Offer URL"
              placeholder="https://..."
              value={offerUrl}
              onChange={(e) => setOfferUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="follow-up-date">Follow-up date</label>

          <div className="input-with-icon">
            <CalendarDays size={17} aria-hidden="true" />
            <input
              id="follow-up-date"
              type="date"
              aria-label="Follow-up date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field form-field-full">
          <label htmlFor="notes">Notes</label>

          <div className="input-with-icon textarea-with-icon">
            <FileText size={17} aria-hidden="true" />
            <textarea
              id="notes"
              aria-label="Notes"
              placeholder="Notes about this application..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <button type="submit">
          <Plus size={17} aria-hidden="true" />
          Add application
        </button>
      </form>

      <section className="applications-panel">
        <h2 className="section-title applications-title">Applications</h2>

        <section className="tracker-toolbar">
          <div className="filters-group">
            <div className="search-control">
              <Search size={18} aria-hidden="true" />

              <input
                type="text"
                aria-label="Search applications"
                placeholder="Search company or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <select
              aria-label="Filter applications by status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as JobStatus | "all")
              }
              className="status-filter"
            >
              <option value="all">All statuses</option>
              <option value="todo">Todo</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              aria-label="Filter applications by follow-up"
              value={followUpFilter}
              onChange={(e) =>
                setFollowUpFilter(
                  e.target.value as
                    | "all"
                    | "upcoming"
                    | "today"
                    | "overdue"
                    | "no-date",
                )
              }
              className="status-filter"
            >
              <option value="all">All follow-ups</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="overdue">Overdue</option>
              <option value="no-date">No date</option>
            </select>
          </div>

          <div className="offers-counter">
            <div className="counter-content">
              <span>Total applications</span>
              <strong>{jobs.length}</strong>
            </div>

            <span className="counter-icon" aria-hidden="true">
              <BarChart3 size={19} />
            </span>
          </div>
        </section>

        {filteredJobs.length === 0 ? (
          <div className="empty-state">
            {jobs.length === 0 ? (
              <>
                <p>No applications yet.</p>
                <p>
                  Add your first job application to start tracking your search.
                </p>
              </>
            ) : (
              <>
                <p>No matching applications.</p>
                <p>Try changing your search or status filter.</p>
              </>
            )}
          </div>
        ) : (
          <div className="table-scroll">
            <JobTable
              jobs={filteredJobs}
              editingId={editingId}
              setEditingId={setEditingId}
              updateJob={updateJob}
              cycleStatus={cycleStatus}
              resetStatus={resetStatus}
              deleteJob={deleteJob}
            />
          </div>
        )}
      </section>
    </main>
  );
}
