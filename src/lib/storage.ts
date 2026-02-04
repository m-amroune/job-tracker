import { JobApplication } from "@/types/job";

export const JOBS_STORAGE_KEY = "job-tracker-applications";

export function loadJobs(): JobApplication[] {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem(JOBS_STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as JobApplication[];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: JobApplication[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
}
