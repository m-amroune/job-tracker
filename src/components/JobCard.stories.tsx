import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { JobApplication } from "@/types/job";
import JobCard from "./JobCard";

const baseJob: JobApplication = {
  id: "1",
  company: "Nova Digital",
  position: "Frontend Developer",
  status: "todo",
  createdAt: "2026-08-27T10:00:00.000Z",
  offerUrl: "https://example.com/job",
  followUpDate: "2099-09-02",
  notes: "Application sent after speaking with the recruiter.",
};

const meta = {
  title: "Components/JobCard",
  component: JobCard,
  parameters: {
    layout: "centered",
  },
  args: {
    editingId: null,
    setEditingId: () => {},
    updateJob: () => {},
    cycleStatus: () => {},
    resetStatus: () => {},
    deleteJob: () => {},
  },
} satisfies Meta<typeof JobCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    job: baseJob,
  },
};

export const Interview: Story = {
  args: {
    job: {
      ...baseJob,
      status: "interview",
    },
  },
};

export const Overdue: Story = {
  args: {
    job: {
      ...baseJob,
      followUpDate: "2020-01-10",
    },
  },
};

export const LongNotes: Story = {
  args: {
    job: {
      ...baseJob,
      notes:
        "First interview completed. Technical interview scheduled with the frontend team. Prepare React, TypeScript and Next.js examples before the meeting.",
    },
  },
};

export const Editing: Story = {
  args: {
    job: baseJob,
    editingId: "1",
  },
};