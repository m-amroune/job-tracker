"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { JobApplication, JobStatus } from "@/types/job";

const STATUS_ORDER = ["todo", "applied", "interview", "rejected"] as const;

function getNextStatus(current: JobStatus): JobStatus {
  const index = STATUS_ORDER.indexOf(current);
  const nextIndex = (index + 1) % STATUS_ORDER.length;
  return STATUS_ORDER[nextIndex];
}

export default function Page() {
  // Job applications state (client-side only)
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Load from localStorage on client only
  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  // Add a new job application
  // Update state and localStorage
  function addJob() {
    const newJob: JobApplication = {
      id: crypto.randomUUID(),
      company: "Example company",
      position: "Example position",
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    // Create a new array (do not mutate state)
    const updatedJobs = [...jobs, newJob];

    // Update state
    setJobs(updatedJobs);

    // Save to localStorage
    saveJobs(updatedJobs);
  }

  function cycleStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, status: getNextStatus(job.status) } : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  return (
    <main>
      <h1>Job tracker</h1>
      <button onClick={addJob}>Add application</button>

      {jobs.length === 0 ? (
        <p>No applications yet</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id} onClick={() => cycleStatus(job.id)}>
              {job.company} — {job.position} ({job.status})
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
