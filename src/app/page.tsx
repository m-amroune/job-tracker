"use client";

import { useState } from "react";
import { loadJobs } from "@/lib/storage";
import { JobApplication } from "@/types/job";

export default function Home() {
  // Main state: job applications list
  // Initialized once from localStorage
  const [jobs] = useState<JobApplication[]>(() => loadJobs());

  return (
    <main>
      <h1>Job tracker</h1>

      {/* Jobs count */}
      <p>{jobs.length} applications</p>
    </main>
  );
}
