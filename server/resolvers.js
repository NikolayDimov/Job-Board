import { getCompany } from "./db/companies.js";
import { getJob, getJobs } from "./db/jobs.js";

export const resolvers = {
    Query: {
        job: (_root, { id }) => getJob(id),
        jobs: async () => {
            const jobs = await getJobs();
            console.log(jobs);
            return jobs;
        },
    },

    // Same as:
    // Query: {
    //     jobs: () => getJobs(),

    Job: {
        company: (job) => getCompany(job.companyId),
        date: (job) => toIsoDate(job.createdAt),
    },

    // Job: {
    //     date: () => "2022-12-31",
    // },
};

function toIsoDate(value) {
    return value.slice(0, "yyyy-mm-dd".length);
}
