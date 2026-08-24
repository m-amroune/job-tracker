import { fireEvent, render, screen } from "@testing-library/react";
import JobTable from "./JobTable";
import type { JobApplication } from "@/types/job";

const jobs: JobApplication[] = [
  {
    id: "1",
    company: "Nova Digital",
    position: "Frontend Developer",
    status: "todo",
    createdAt: "2026-02-03",
    offerUrl: "https://example.com/job-1",
  },
  {
    id: "2",
    company: "Tech Agency",
    position: "React Developer",
    status: "applied",
    createdAt: "2026-02-06",
    offerUrl: "https://example.com/job-2",
  },
];

describe("JobTable", () => {
  test("displays all applications in desktop and mobile layouts", () => {
    render(
      <JobTable
        jobs={jobs}
        sortConfig={{ key: "createdAt", dir: "desc" }}
        setSortConfig={jest.fn()}
        editingId={null}
        setEditingId={jest.fn()}
        updateJob={jest.fn()}
        cycleStatus={jest.fn()}
        resetStatus={jest.fn()}
        deleteJob={jest.fn()}
      />,
    );

    expect(screen.getAllByText("Nova Digital")).toHaveLength(2);
    expect(screen.getAllByText("Tech Agency")).toHaveLength(2);
  });
  test("requests ascending sorting when a column header is clicked", () => {
  const setSortConfig = jest.fn();

  render(
    <JobTable
      jobs={jobs}
      sortConfig={{ key: "createdAt", dir: "desc" }}
      setSortConfig={setSortConfig}
      editingId={null}
      setEditingId={jest.fn()}
      updateJob={jest.fn()}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.click(
    screen.getByRole("columnheader", { name: "Company" }),
  );

  expect(setSortConfig).toHaveBeenCalledWith({
    key: "company",
    dir: "asc",
  });
});
test("sorts by follow-up date when clicking the Follow-up header", () => {
  const setSortConfig = jest.fn();

  render(
    <JobTable
      jobs={jobs}
      sortConfig={{ key: "createdAt", dir: "desc" }}
      setSortConfig={setSortConfig}
      editingId={null}
      setEditingId={jest.fn()}
      updateJob={jest.fn()}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.click(
  screen.getByRole("columnheader", {
    name: "Follow-up",
  }),
);

  expect(setSortConfig).toHaveBeenCalledWith({
    key: "followUpDate",
    dir: "asc",
  });
});
});