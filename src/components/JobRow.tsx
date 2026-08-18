"use client";

import { JobApplication } from "@/types/job";
import { getFollowUpStatus } from "@/lib/followUp";

interface JobRowProps {
  job: JobApplication;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateJob: (
    id: string,
    field: "company" | "position" | "offerUrl" | "followUpDate",
    value: string,
  ) => void;
  cycleStatus: (id: string) => void;
  resetStatus: (id: string) => void;
  deleteJob: (id: string) => void;
}

export default function JobRow({
  job,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
}: JobRowProps) {
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
    <tr>
      {/* Company field */}
      <td className="center">
        {editingId === job.id ? (
          <input
            aria-label={`Company for ${job.position}`}
            value={job.company}
            onChange={(e) => updateJob(job.id, "company", e.target.value)}
          />
        ) : (
          job.company
        )}
      </td>

      {/* Position field */}
      <td className="center">
        {editingId === job.id ? (
          <input
            aria-label={`Position at ${job.company}`}
            value={job.position}
            onChange={(e) => updateJob(job.id, "position", e.target.value)}
          />
        ) : (
          job.position
        )}
      </td>

      {/* Status can be changed directly from the table */}
      <td className="center status-cell">
        <button
          type="button"
          className={`status-badge status-${job.status}`}
          aria-label={`Change status for ${job.company}. Current status: ${job.status}`}
          onClick={() => cycleStatus(job.id)}
        >
          {job.status}
        </button>
      </td>

      {/* Application creation date */}
      <td className="center date-cell">
        {new Date(job.createdAt).toLocaleDateString()}
      </td>

      {/* Follow-up date and its current state */}
      <td
        className={`center date-cell ${
          followUpStatus ? `follow-up-${followUpStatus}` : ""
        }`}
      >
        {editingId === job.id ? (
          <input
            type="date"
            aria-label={`Follow-up date for ${job.company}`}
            value={job.followUpDate ?? ""}
            onChange={(e) =>
              updateJob(job.id, "followUpDate", e.target.value)
            }
          />
        ) : job.followUpDate ? (
          new Date(`${job.followUpDate}T00:00:00`).toLocaleDateString()
        ) : (
          "No date"
        )}
      </td>

      {/* Offer link */}
      <td className="center">
        {editingId === job.id ? (
          <input
            aria-label={`Offer URL for ${job.company}`}
            value={job.offerUrl ?? ""}
            onChange={(e) => updateJob(job.id, "offerUrl", e.target.value)}
          />
        ) : job.offerUrl ? (
          <a href={job.offerUrl} target="_blank" rel="noopener noreferrer">
            View
          </a>
        ) : (
          <span>No link</span>
        )}
      </td>

      {/* Row actions */}
      <td className="center actions">
        <div className="action-wrapper">
          {editingId === job.id ? (
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
            onClick={(e) => {
              e.stopPropagation();

              if (window.confirm("Delete this application?")) {
                deleteJob(job.id);
              }
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}