"use client";
import { JobApplication } from "@/types/job";

interface JobRowProps {
  job: JobApplication;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updateJob: (id: string, field: "company" | "position", value: string) => void;
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
            value={job.position}
            onChange={(e) => updateJob(job.id, "position", e.target.value)}
          />
        ) : (
          job.position
        )}
      </td>

      {/* status cycle */}
      <td className="center status-cell">
        <span onClick={() => cycleStatus(job.id)}>{job.status}</span>
      </td>

      {/* created date */}
      <td className="center date-cell">
        {new Date(job.createdAt).toLocaleDateString()}
      </td>
      <td className="center">
        {job.offerUrl && job.offerUrl.trim() !== "" ? (
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
          {/* edit / save */}
          {editingId === job.id ? (
            <button onClick={() => setEditingId(null)}>Save</button>
          ) : (
            <button onClick={() => setEditingId(job.id)}>Edit</button>
          )}

          {/* reset status */}
          <button onClick={() => resetStatus(job.id)}>Reset</button>

          {/* delete job */}
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
