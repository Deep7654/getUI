// lib/jobStore.ts
type JobStatus = "pending" | "running" | "completed" | "failed";

interface JobData {
  status: JobStatus;
  result?: any;
}

const jobStore: Record<string, JobData> = {};

export const setJobStatus = (jobId: string, status: JobStatus, result?: any) => {
  jobStore[jobId] = { status, result };
};

export const getJobStatus = (jobId: string) => {
  return jobStore[jobId] || { status: "unknown" };
};
