import { JobApplication } from "@/types/job";

const STORAGE_KEY = "jobs";

/**
 * Load raw data from localStorage.
 * Returns unknown so caller must validate/normalize.
 */
export function loadJobs(): unknown {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveJobs(jobs: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}
