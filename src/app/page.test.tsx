import { fireEvent, render, screen } from "@testing-library/react";
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

  const companyInput = screen.getByRole("textbox", {
    name: "Company",
  });
  const positionInput = screen.getByRole("textbox", {
    name: "Position",
  });
  const offerUrlInput = screen.getByRole("textbox", {
    name: "Offer URL",
  });

  fireEvent.change(companyInput, {
    target: { value: "Acme Studio" },
  });
  fireEvent.change(positionInput, {
    target: { value: "React Developer" },
  });
  fireEvent.change(offerUrlInput, {
    target: { value: "https://example.com/acme-job" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: "Add application" }),
  );

  expect(await screen.findAllByText("Acme Studio")).toHaveLength(2);
  expect(companyInput).toHaveValue("");
  expect(positionInput).toHaveValue("");
  expect(offerUrlInput).toHaveValue("");
});

test("saves the follow-up date when adding an application", async () => {
  render(<Home />);

  await screen.findAllByText("Nova Digital");

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Company",
    }),
    {
      target: { value: "Acme Studio" },
    },
  );

  fireEvent.change(
    screen.getByRole("textbox", {
      name: "Position",
    }),
    {
      target: { value: "React Developer" },
    },
  );

  fireEvent.change(
    screen.getByLabelText("Follow-up date"),
    {
      target: { value: "2026-08-25" },
    },
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: "Add application",
    }),
  );

  const savedJobs = JSON.parse(localStorage.getItem("jobs") ?? "[]");

  const savedJob = savedJobs.find(
    (job: { company: string }) => job.company === "Acme Studio",
  );

  expect(savedJob.followUpDate).toBe("2026-08-25");
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
});