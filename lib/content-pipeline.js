import fs from "node:fs";
import path from "node:path";

const JOBS_PATH = path.join(process.cwd(), "data", "content-pipeline-jobs.json");

function safeReadJson(filePath, fallback) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}

export function listPipelineJobs({ jobsPath = JOBS_PATH } = {}) {
  return safeReadJson(jobsPath, []);
}
