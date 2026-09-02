"use client";

import { JobApplication } from "@/types/job";
import { getFollowUpStatus } from "@/lib/followUp";
import {
  ExternalLink,
  Pencil,
  RotateCcw,
  StickyNote,
  Trash2,
} from "lucide-react";

interface JobRowProps {
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
  isExpanded: boolean;
  onToggleDetails: () => void;
}

export default function JobRow({
  job,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
  isExpanded,
  onToggleDetails,
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

  const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  return (
    <>
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
            <div className="company-cell-content">
             

              <span className="company-initial" aria-hidden="true">
                {job.company.charAt(0).toUpperCase()}
              </span>

              <span className="company-name">{job.company}</span>
            </div>
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
          {shortDateFormatter.format(new Date(job.createdAt))}
        </td>

        {/* Follow-up date and its current state */}
        <td className="center date-cell">
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
            <span className={`follow-up-badge follow-up-${followUpStatus}`}>
              {shortDateFormatter.format(
                new Date(`${job.followUpDate}T00:00:00`),
              )}
            </span>
          ) : (
            <span className="follow-up-empty">No date</span>
          )}
        </td>

<td className="notes-cell">
  {job.notes ? (
    <button
      type="button"
      className={`notes-button ${isExpanded ? "is-open" : ""}`}
      aria-label={`${isExpanded ? "Hide" : "Show"} notes for ${job.company}`}
      onClick={onToggleDetails}
    >
      <StickyNote size={17} aria-hidden="true" />
    </button>
  ) : (
    <span className="notes-empty" aria-label="No notes">
      <StickyNote size={17} aria-hidden="true" />
    </span>
  )}
</td>

        <td className="offer-cell">
          {editingId === job.id ? (
            <input
              type="url"
              aria-label={`Offer URL for ${job.company}`}
              value={job.offerUrl ?? ""}
              onChange={(e) => updateJob(job.id, "offerUrl", e.target.value)}
            />
          ) : job.offerUrl ? (
            <a
              className="offer-link"
              href={job.offerUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open job offer for ${job.company}`}
              title="Open job offer"
            >
              <ExternalLink size={17} aria-hidden="true" />
            </a>
          ) : (
            <span className="offer-empty" aria-label="No offer link">
              -
            </span>
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
                className="action-secondary action-icon"
                aria-label={`Edit ${job.company}`}
                title="Edit"
                onClick={() => {
                  setEditingId(job.id);

                  if (!isExpanded) {
                    onToggleDetails();
                  }
                }}
              >
                <Pencil size={16} aria-hidden="true" />
              </button>
            )}

            <button
              className="action-reset action-icon"
              aria-label={`Reset status for ${job.company}`}
              title="Reset status"
              onClick={() => resetStatus(job.id)}
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>

            <button
              className="danger action-icon"
              aria-label={`Delete ${job.company}`}
              title="Delete"
              onClick={(e) => {
                e.stopPropagation();

                if (window.confirm("Delete this application?")) {
                  deleteJob(job.id);
                }
              }}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="job-details-row">
          <td colSpan={8}>
            <div className="job-details-panel">
              <div className="job-detail-block">
                <span className="job-detail-label">Notes</span>

                {editingId === job.id ? (
                  <textarea
                    aria-label={`Notes for ${job.company}`}
                    value={job.notes ?? ""}
                    onChange={(e) => updateJob(job.id, "notes", e.target.value)}
                  />
                ) : job.notes ? (
                  <p className="job-detail-text">{job.notes}</p>
                ) : (
                  <span className="empty-value">No notes</span>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
