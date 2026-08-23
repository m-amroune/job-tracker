"use client";

import { JobApplication } from "@/types/job";
import { getFollowUpStatus } from "@/lib/followUp";

interface JobCardProps {
  job: JobApplication;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateJob: (
    id: string,
    field: "company" | "position" | "offerUrl" | "followUpDate" | "notes",
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

  // Build today's local date in the same YYYY-MM-DD format as followUpDate.
  const now = new Date();

  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(now.getDate()).padStart(2, "0")}`;

  // Determine which visual state should be used for the follow-up date.
  const followUpStatus = job.followUpDate
    ? getFollowUpStatus(job.followUpDate, today)
    : undefined;

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

        {/* Status can be changed directly from the card */}
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

        {/* Follow-up date and its current state */}
        <div>
          <span className="job-card-label">Follow-up</span>

          {isEditing ? (
            <input
              type="date"
              aria-label={`Follow-up date for ${job.company}`}
              value={job.followUpDate ?? ""}
              onChange={(e) =>
                updateJob(job.id, "followUpDate", e.target.value)
              }
            />
          ) : (
            <span
              className={
                followUpStatus ? `follow-up-${followUpStatus}` : undefined
              }
            >
              {job.followUpDate
                ? new Date(
                    `${job.followUpDate}T00:00:00`,
                  ).toLocaleDateString()
                : "No date"}
            </span>
          )}
        </div>

        {/* Application notes */}
<div>
  <span className="job-card-label">Notes</span>

  {isEditing ? (
    <textarea
      aria-label={`Notes for ${job.company}`}
      value={job.notes ?? ""}
      onChange={(e) => updateJob(job.id, "notes", e.target.value)}
    />
  ) : (
    <span>{job.notes || "No notes"}</span>
  )}
</div>

        {/* Offer link */}
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

      {/* Card actions */}
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
