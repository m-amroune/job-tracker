import JobRow from "./JobRow";
import { JobApplication } from "@/types/job";

type SortKey = "company" | "position" | "status" | "createdAt";

interface JobTableProps {
  jobs: JobApplication[];

  sortConfig: {
    key: SortKey;
    dir: "asc" | "desc";
  };

  setSortConfig: (config: { key: SortKey; dir: "asc" | "desc" }) => void;

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

export default function JobTable({
  jobs,
  sortConfig,
  setSortConfig,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
}: JobTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th
            onClick={() =>
              setSortConfig({
                key: "company",
                dir:
                  sortConfig.key === "company" && sortConfig.dir === "asc"
                    ? "desc"
                    : "asc",
              })
            }
          >
            Company
          </th>

          <th
            onClick={() =>
              setSortConfig({
                key: "position",
                dir:
                  sortConfig.key === "position" && sortConfig.dir === "asc"
                    ? "desc"
                    : "asc",
              })
            }
          >
            Position
          </th>

          <th
            onClick={() =>
              setSortConfig({
                key: "status",
                dir:
                  sortConfig.key === "status" && sortConfig.dir === "asc"
                    ? "desc"
                    : "asc",
              })
            }
          >
            Status
          </th>

          <th
            onClick={() =>
              setSortConfig({
                key: "createdAt",
                dir:
                  sortConfig.key === "createdAt" && sortConfig.dir === "asc"
                    ? "desc"
                    : "asc",
              })
            }
          >
            Date
          </th>

          <th>Link</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {jobs.map((job) => (
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
  );
}
