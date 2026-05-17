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
      <td>
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
      <td>
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
      <td className="status-cell">
        <span onClick={() => cycleStatus(job.id)}>{job.status}</span>
      </td>

      {/* created date */}
      <td>{new Date(job.createdAt).toLocaleDateString()}</td>

      {/* actions */}
      <td className="actions">
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
      </td>
    </tr>
  );
}
