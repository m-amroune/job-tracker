export type JobStatus = "todo" | "applied" | "interview" | "rejected";

export type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  createdAt: string;
  offerUrl?: string;
  notes?: string;
};
