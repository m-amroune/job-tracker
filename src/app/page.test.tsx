import { fireEvent, render, screen, within } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loads the demo applications when storage is empty", async () => {
    render(<Home />);

    expect(await screen.findAllByText("Nova Digital")).toHaveLength(2);
    expect(await screen.findAllByText("Dream startup")).toHaveLength(2);
    expect(await screen.findAllByText("Tech agency")).toHaveLength(2);
  });
test("adds an application and clears the form", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const dialog = screen.getByRole("dialog", {
    name: "Add application",
  });

  fireEvent.change(
    within(dialog).getByRole("textbox", {
      name: "Company",
    }),
    {
      target: { value: "Acme Studio" },
    },
  );

  fireEvent.change(
    within(dialog).getByRole("textbox", {
      name: "Position",
    }),
    {
      target: { value: "React Developer" },
    },
  );

  fireEvent.change(
    within(dialog).getByRole("textbox", {
      name: "Offer URL",
    }),
    {
      target: { value: "https://example.com/acme-job" },
    },
  );

  fireEvent.click(
    within(dialog).getByRole("button", {
      name: "Add application",
    }),
  );

  expect(await screen.findAllByText("Acme Studio")).toHaveLength(2);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const reopenedDialog = screen.getByRole("dialog", {
    name: "Add application",
  });

  expect(within(reopenedDialog).getByLabelText("Company")).toHaveValue("");
  expect(within(reopenedDialog).getByLabelText("Position")).toHaveValue("");
  expect(within(reopenedDialog).getByLabelText("Offer URL")).toHaveValue("");
});

test("saves the follow-up date when adding an application", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const dialog = screen.getByRole("dialog", {
    name: "Add application",
  });

  fireEvent.change(within(dialog).getByLabelText("Company"), {
    target: { value: "Acme Studio" },
  });

  fireEvent.change(within(dialog).getByLabelText("Position"), {
    target: { value: "React Developer" },
  });

  fireEvent.change(within(dialog).getByLabelText("Follow-up date"), {
    target: { value: "2026-08-25" },
  });

  fireEvent.click(
    within(dialog).getByRole("button", {
      name: "Add application",
    }),
  );

  const savedJobs = JSON.parse(localStorage.getItem("jobs") ?? "[]");

  const savedJob = savedJobs.find(
    (job: { company: string }) => job.company === "Acme Studio",
  );

  expect(savedJob.followUpDate).toBe("2026-08-25");
});
test("saves notes when adding an application", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const dialog = screen.getByRole("dialog", {
    name: "Add application",
  });

  fireEvent.change(within(dialog).getByLabelText("Company"), {
    target: { value: "Acme Studio" },
  });

  fireEvent.change(within(dialog).getByLabelText("Position"), {
    target: { value: "React Developer" },
  });

  fireEvent.change(within(dialog).getByLabelText("Notes"), {
    target: { value: "Contacted recruiter on LinkedIn" },
  });

  fireEvent.click(
    within(dialog).getByRole("button", {
      name: "Add application",
    }),
  );

  const savedJobs = JSON.parse(localStorage.getItem("jobs") ?? "[]");

  const savedJob = savedJobs.find(
    (job: { company: string }) => job.company === "Acme Studio",
  );

  expect(savedJob.notes).toBe("Contacted recruiter on LinkedIn");
});

test("filters applications with the search field", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Search applications",
    }),
    {
      target: { value: "Nova" },
    },
  );

  expect(screen.getAllByText("Nova Digital")).toHaveLength(2);
  expect(screen.queryByText("Dream startup")).not.toBeInTheDocument();
  expect(screen.queryByText("Tech agency")).not.toBeInTheDocument();
});
test("filters applications by status", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.change(
    screen.getByRole("combobox", {
      name: "Filter applications by status",
    }),
    {
      target: { value: "applied" },
    },
  );

  expect(screen.getAllByText("Dream startup")).toHaveLength(2);
  expect(screen.queryByText("Nova Digital")).not.toBeInTheDocument();
  expect(screen.queryByText("Tech agency")).not.toBeInTheDocument();
});

test("filters applications by follow-up status", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const dialog = screen.getByRole("dialog", {
    name: "Add application",
  });

  fireEvent.change(within(dialog).getByLabelText("Company"), {
    target: { value: "Acme Studio" },
  });

  fireEvent.change(within(dialog).getByLabelText("Position"), {
    target: { value: "React Developer" },
  });

  fireEvent.change(within(dialog).getByLabelText("Follow-up date"), {
    target: { value: "2099-01-01" },
  });

  fireEvent.click(
    within(dialog).getByRole("button", {
      name: "Add application",
    }),
  );

  expect(screen.getAllByText("Acme Studio").length).toBeGreaterThan(0);

  fireEvent.change(
    screen.getByLabelText("Filter applications by follow-up"),
    {
      target: { value: "no-date" },
    },
  );

  expect(screen.queryByText("Acme Studio")).not.toBeInTheDocument();
});
});

