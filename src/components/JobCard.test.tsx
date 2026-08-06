import { fireEvent, render, screen } from "@testing-library/react";
import JobCard from "./JobCard";
import type { JobApplication } from "@/types/job";

const job: JobApplication = {
  id: "1",
  company: "Nova Digital",
  position: "Frontend Developer",
  status: "todo",
  createdAt: "2026-02-03",
  offerUrl: "https://example.com/job",
};

describe("JobCard", () => {
  test("displays the application information", () => {
    render(
      <JobCard
        job={job}
        editingId={null}
        setEditingId={jest.fn()}
        updateJob={jest.fn()}
        cycleStatus={jest.fn()}
        resetStatus={jest.fn()}
        deleteJob={jest.fn()}
      />,
    );

    expect(screen.getByText("Nova Digital")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("todo")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "View offer" }),
    ).toHaveAttribute("href", "https://example.com/job");
  });
  test("starts editing the application", () => {
  const setEditingId = jest.fn();

  render(
    <JobCard
      job={job}
      editingId={null}
      setEditingId={setEditingId}
      updateJob={jest.fn()}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit" }));

  expect(setEditingId).toHaveBeenCalledWith("1");
});
test("updates the company field", () => {
  const updateJob = jest.fn();

  render(
    <JobCard
      job={job}
      editingId="1"
      setEditingId={jest.fn()}
      updateJob={updateJob}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Company" }), {
    target: { value: "New Company" },
  });

  expect(updateJob).toHaveBeenCalledWith("1", "company", "New Company");
});
test("updates the position field", () => {
  const updateJob = jest.fn();

  render(
    <JobCard
      job={job}
      editingId="1"
      setEditingId={jest.fn()}
      updateJob={updateJob}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Position" }), {
    target: { value: "React Developer" },
  });

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "position",
    "React Developer",
  );
});
test("updates the offer URL field", () => {
  const updateJob = jest.fn();

  render(
    <JobCard
      job={job}
      editingId="1"
      setEditingId={jest.fn()}
      updateJob={updateJob}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.change(screen.getByRole("textbox", { name: "Offer URL" }), {
    target: { value: "https://example.com/new-job" },
  });

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "offerUrl",
    "https://example.com/new-job",
  );
});
test("stops editing the application", () => {
  const setEditingId = jest.fn();

  render(
    <JobCard
      job={job}
      editingId="1"
      setEditingId={setEditingId}
      updateJob={jest.fn()}
      cycleStatus={jest.fn()}
      resetStatus={jest.fn()}
      deleteJob={jest.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: "Save" }));

  expect(setEditingId).toHaveBeenCalledWith(null);
});
});