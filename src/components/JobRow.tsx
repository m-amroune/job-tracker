"use client";
import { JobApplication } from "@/types/job";

interface JobRowProps {
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

export default function JobRow({
  job,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
}: JobRowProps) {
  return (
    <tr>
      {/* company field (editable) */}
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

      {/* position field (editable) */}
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

      {/* status cycle */}
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

      {/* created date */}
      <td className="center date-cell">
        {new Date(job.createdAt).toLocaleDateString()}
      </td>

      {/* offer URL  */}
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

      {/* actions */}
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
