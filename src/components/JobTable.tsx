import JobRow from "./JobRow";
import JobCard from "./JobCard";
import { JobApplication } from "@/types/job";
import {
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";


  const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const columns: Array<ColumnDef<typeof features, JobApplication>> = [
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "followUpDate",
    header: "Follow-up",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "offerUrl",
    header: "Link",
  },
];

interface JobTableProps {
  jobs: JobApplication[];



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

export default function JobTable({
  jobs,
  editingId,
  setEditingId,
  updateJob,
  cycleStatus,
  resetStatus,
  deleteJob,
}: JobTableProps) {
  const table = useTable({
  features,
  columns,
  data: jobs,
});
  return (
    <>
      {/* Desktop layout uses a sortable table */}
      <div className="desktop-table">
        <table>
  <thead>
  {table.getHeaderGroups().map((headerGroup) => (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <th
          key={header.id}
          onClick={header.column.getToggleSortingHandler()}
        >
          {header.isPlaceholder ? null : (
            <table.FlexRender header={header} />
          )}
        </th>
      ))}

      <th>Actions</th>
    </tr>
  ))}
</thead>

          <tbody>
  {table.getRowModel().rows.map((row) => (
    <JobRow
      key={row.original.id}
      job={row.original}
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
      </div>

      {/* Mobile layout reuses the same jobs and actions as individual cards */}
      <div className="mobile-cards">
        {jobs.map((job) => (
          <JobCard
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
      </div>
    </>
  );
}
