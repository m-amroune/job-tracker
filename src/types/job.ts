// types/job.ts
export type JobStatus = "todo" | "applied" | "interview" | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  createdAt: string;
  offerUrl?: string;
  notes?: string;
}
