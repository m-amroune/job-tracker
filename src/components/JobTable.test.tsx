import { fireEvent, render, screen, within } from "@testing-library/react";
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
    followUpDate: "2026-03-10",
  },
  {
    id: "2",
    company: "Tech Agency",
    position: "React Developer",
    status: "applied",
    createdAt: "2026-02-06",
    offerUrl: "https://example.com/job-2",
    followUpDate: "2026-02-20",
  },
];

describe("JobTable", () => {
  test("displays all applications in desktop and mobile layouts", () => {
    render(
      <JobTable
        jobs={jobs}
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

  test("sorts applications when a column header is clicked", () => {
  render(
    <JobTable
      jobs={[...jobs].reverse()}
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
      name: /Company/,
    }),
  );

  const table = screen.getByRole("table");
  const rows = within(table).getAllByRole("row");

  expect(within(rows[1]).getByText("Nova Digital")).toBeInTheDocument();
  expect(within(rows[2]).getByText("Tech Agency")).toBeInTheDocument();
});

  test("sorts applications by follow-up date", () => {
    render(
      <JobTable
        jobs={jobs}
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
  name: /Follow-up/,
})
    );

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    expect(within(rows[1]).getByText("Tech Agency")).toBeInTheDocument();
    expect(within(rows[2]).getByText("Nova Digital")).toBeInTheDocument();
  });
});