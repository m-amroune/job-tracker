// types/job.ts

export type JobStatus = "todo" | "applied" | "interview" | "rejected";

// Shape of a job application stored and displayed by the app.
export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  createdAt: string;

  // Optional fields keep older stored applications compatible.
  offerUrl?: string;
  url?: string;
  followUpDate?: string;
}
