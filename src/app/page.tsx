"use client";

import { useState, useEffect } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { JobApplication, JobStatus } from "@/types/job";

// Ordered list of job statuses (business rule)
const STATUS_ORDER = ["todo", "applied", "interview", "rejected"] as const;

// Return the next status in the cycle
function getNextStatus(current: JobStatus): JobStatus {
  const index = STATUS_ORDER.indexOf(current);
  const nextIndex = (index + 1) % STATUS_ORDER.length;
  return STATUS_ORDER[nextIndex];
}

export default function Page() {
  // Job applications state (client-side data)
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  // Load jobs from localStorage after mount
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

    // Create a new array (immutability)
    const updatedJobs = [...jobs, newJob];

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Cycle the status of a job when the list item is clicked
  // Update state and localStorage
  function cycleStatus(id: string) {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, status: getNextStatus(job.status) } : job,
    );

    setJobs(updatedJobs);
    saveJobs(updatedJobs);
  }

  // Delete a job application by id
  // Update state and localStorage
  function deleteJob(id: string) {
    const updatedJobs = jobs.filter((job) => job.id !== id);

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
              <button
                // Prevent click from triggering status change
                onClick={(e) => {
                  e.stopPropagation();
                  deleteJob(job.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
