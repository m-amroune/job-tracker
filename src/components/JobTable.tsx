import { useEffect, useState } from "react";
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
    header: "Added",
  },
  {
    accessorKey: "followUpDate",
    header: "Follow-up",
  },

  {
    accessorKey: "offerUrl",
    header: "Offer",
    enableSorting: false,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleDetails(id: string) {
    setExpandedId((currentId) => (currentId === id ? null : id));
  }
  const table = useTable({
    features,
    columns,
    data: jobs,
  });

  const JOBS_PER_PAGE = 8;

  const [currentPage, setCurrentPage] = useState(1);

  const jobsKey = jobs.map((job) => job.id).join("|");

  useEffect(() => {
    setCurrentPage(1);
  }, [jobsKey]);

  const sortedRows = table.getRowModel().rows;
  const totalPages = Math.ceil(sortedRows.length / JOBS_PER_PAGE);

  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const paginatedRows = sortedRows.slice(
    startIndex,
    startIndex + JOBS_PER_PAGE,
  );
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
                    className={
                      header.column.getCanSort() ? "sortable-header" : undefined
                    }
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <span className="table-header-content">
                        <table.FlexRender header={header} />

                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <span className="sort-indicator">↑</span>
                            ) : header.column.getIsSorted() === "desc" ? (
                              <span className="sort-indicator">↓</span>
                            ) : (
                              <span className="sort-indicator sort-indicator-idle">
                                ↕
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    )}
                  </th>
                ))}

                <th>Manage</th>
                <th>Next action</th>
              </tr>
            ))}
          </thead>

          <tbody>
            {paginatedRows.map((row) => (
              <JobRow
                key={row.original.id}
                job={row.original}
                editingId={editingId}
                setEditingId={setEditingId}
                updateJob={updateJob}
                cycleStatus={cycleStatus}
                resetStatus={resetStatus}
                deleteJob={deleteJob}
                isExpanded={expandedId === row.original.id}
                onToggleDetails={() => toggleDetails(row.original.id)}
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

      {sortedRows.length > JOBS_PER_PAGE && (
        <div className="pagination">
          <span className="pagination-info">
            Showing {startIndex + 1}-
            {Math.min(startIndex + JOBS_PER_PAGE, sortedRows.length)} of{" "}
            {sortedRows.length}
          </span>

          <div
            className="pagination-controls"
            aria-label="Applications pagination"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  className={currentPage === page ? "active" : ""}
                  aria-current={currentPage === page ? "page" : undefined}
                  aria-label={`Go to page ${page}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
