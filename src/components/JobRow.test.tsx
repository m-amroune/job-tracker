import { fireEvent, render, screen } from "@testing-library/react";
import JobRow from "./JobRow";
import type { JobApplication } from "@/types/job";

const job: JobApplication = {
  id: "1",
  company: "Nova Digital",
  position: "Frontend Developer",
  status: "todo",
  createdAt: "2026-02-03",
  offerUrl: "https://example.com/job",
};

describe("JobRow", () => {
  afterEach(() => {
  jest.restoreAllMocks();
});
  test("displays the application information", () => {
    render(
      <table>
        <tbody>
          <JobRow
            job={job}
            editingId={null}
            setEditingId={jest.fn()}
            updateJob={jest.fn()}
            cycleStatus={jest.fn()}
            resetStatus={jest.fn()}
            deleteJob={jest.fn()}
          />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Nova Digital")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("todo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "https://example.com/job",
    );
  });
  test("starts editing the application", () => {
  const setEditingId = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId={null}
          setEditingId={setEditingId}
          updateJob={jest.fn()}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit" }));

  expect(setEditingId).toHaveBeenCalledWith("1");
});
test("updates the company field", () => {
  const updateJob = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId="1"
          setEditingId={jest.fn()}
          updateJob={updateJob}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Company for Frontend Developer",
    }),
    {
      target: { value: "New Company" },
    },
  );

  expect(updateJob).toHaveBeenCalledWith("1", "company", "New Company");
});
test("updates the position field", () => {
  const updateJob = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId="1"
          setEditingId={jest.fn()}
          updateJob={updateJob}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Position at Nova Digital",
    }),
    {
      target: { value: "React Developer" },
    },
  );

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "position",
    "React Developer",
  );
});
test("updates the offer URL field", () => {
  const updateJob = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId="1"
          setEditingId={jest.fn()}
          updateJob={updateJob}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Offer URL for Nova Digital",
    }),
    {
      target: { value: "https://example.com/new-job" },
    },
  );

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "offerUrl",
    "https://example.com/new-job",
  );
});
test("changes the application status", () => {
  const cycleStatus = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId={null}
          setEditingId={jest.fn()}
          updateJob={jest.fn()}
          cycleStatus={cycleStatus}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Change status for Nova Digital. Current status: todo",
    }),
  );

  expect(cycleStatus).toHaveBeenCalledWith("1");
});
test("resets the application status", () => {
  const resetStatus = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId={null}
          setEditingId={jest.fn()}
          updateJob={jest.fn()}
          cycleStatus={jest.fn()}
          resetStatus={resetStatus}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Reset" }));

  expect(resetStatus).toHaveBeenCalledWith("1");
});
test("deletes the application after confirmation", () => {
  const deleteJob = jest.fn();

  jest.spyOn(window, "confirm").mockReturnValue(true);

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId={null}
          setEditingId={jest.fn()}
          updateJob={jest.fn()}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={deleteJob}
        />
      </tbody>
    </table>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Delete" }));

  expect(window.confirm).toHaveBeenCalledWith(
    "Delete this application?",
  );
  expect(deleteJob).toHaveBeenCalledWith("1");
});
test("does not delete the application when confirmation is cancelled", () => {
  const deleteJob = jest.fn();

  jest.spyOn(window, "confirm").mockReturnValue(false);

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId={null}
          setEditingId={jest.fn()}
          updateJob={jest.fn()}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={deleteJob}
        />
      </tbody>
    </table>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Delete" }));

  expect(window.confirm).toHaveBeenCalledWith(
    "Delete this application?",
  );
  expect(deleteJob).not.toHaveBeenCalled();
});
});

test("updates the follow-up date", () => {
  const updateJob = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId="1"
          setEditingId={jest.fn()}
          updateJob={updateJob}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.change(
    screen.getByLabelText("Follow-up date for Nova Digital"),
    {
      target: { value: "2026-08-25" },
    },
  );

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "followUpDate",
    "2026-08-25",
  );
});

test("updates the notes field", () => {
  const updateJob = jest.fn();

  render(
    <table>
      <tbody>
        <JobRow
          job={job}
          editingId="1"
          setEditingId={jest.fn()}
          updateJob={updateJob}
          cycleStatus={jest.fn()}
          resetStatus={jest.fn()}
          deleteJob={jest.fn()}
        />
      </tbody>
    </table>,
  );

  fireEvent.change(screen.getByLabelText("Notes for Nova Digital"), {
    target: { value: "Interview scheduled for Friday" },
  });

  expect(updateJob).toHaveBeenCalledWith(
    "1",
    "notes",
    "Interview scheduled for Friday",
  );
});