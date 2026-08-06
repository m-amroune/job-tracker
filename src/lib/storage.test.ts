import { loadJobs, saveJobs } from "./storage";
import type { JobApplication } from "@/types/job";

const jobs: JobApplication[] = [
  {
    id: "1",
    company: "Nova Digital",
    position: "Frontend Developer",
    status: "todo",
    createdAt: "2026-02-03",
    offerUrl: "https://example.com/job",
  },
];

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("returns an empty array when localStorage is empty", () => {
    expect(loadJobs()).toEqual([]);
  });

  test("loads saved applications from localStorage", () => {
    localStorage.setItem("jobs", JSON.stringify(jobs));

    expect(loadJobs()).toEqual(jobs);
  });

  test("saves applications to localStorage", () => {
    saveJobs(jobs);

    expect(localStorage.getItem("jobs")).toBe(JSON.stringify(jobs));
  });
});