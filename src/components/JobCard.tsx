"use client";

import { JobApplication } from "@/types/job";

interface JobCardProps {
  job: JobApplication;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateJob: (
    id: string,
    field: "company" | "position" | "offerUrl",
    value: string,
  ) => void;
  cycleStatus: (id: string) => void;
  resetStatus: (id: string) => void;
  deleteJob: (id: string) => void;
}

export default function JobCard({
  job,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
}: JobCardProps) {
  const isEditing = editingId === job.id;

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div className="job-card-main">
          {isEditing ? (
            <>
              <input
                aria-label="Company"
                value={job.company}
                onChange={(e) => updateJob(job.id, "company", e.target.value)}
              />

              <input
                aria-label="Position"
                value={job.position}
                onChange={(e) => updateJob(job.id, "position", e.target.value)}
              />
            </>
          ) : (
            <>
              <h3>{job.company}</h3>
              <p>{job.position}</p>
            </>
          )}
        </div>

        <button
          type="button"
          className={`status-badge status-${job.status}`}
          aria-label={`Change status for ${job.company}. Current status: ${job.status}`}
          onClick={() => cycleStatus(job.id)}
        >
          {job.status}
        </button>
      </div>

      <div className="job-card-details">
        <div>
          <span className="job-card-label">Date</span>
          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
        </div>

        <div>
          <span className="job-card-label">Offer</span>

          {isEditing ? (
            <input
              aria-label="Offer URL"
              value={job.offerUrl ?? ""}
              onChange={(e) => updateJob(job.id, "offerUrl", e.target.value)}
            />
          ) : job.offerUrl ? (
            <a href={job.offerUrl} target="_blank" rel="noopener noreferrer">
              View offer
            </a>
          ) : (
            <span>No link</span>
          )}
        </div>
      </div>

      <div className="job-card-actions">
        {isEditing ? (
          <button
            className="action-secondary"
            onClick={() => setEditingId(null)}
          >
            Save
          </button>
        ) : (
          <button
            className="action-secondary"
            onClick={() => setEditingId(job.id)}
          >
            Edit
          </button>
        )}

        <button className="action-reset" onClick={() => resetStatus(job.id)}>
          Reset
        </button>

        <button
          className="danger"
          onClick={() => {
            if (window.confirm("Delete this application?")) {
              deleteJob(job.id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
