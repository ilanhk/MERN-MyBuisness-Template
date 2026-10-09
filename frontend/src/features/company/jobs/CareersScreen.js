import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSelectJobs } from "./state/hooks";
import JobPost from "./components/JobPost";
const CareersScreen = () => {
    const jobs = useSelectJobs();
    const sortJobsByCategory = (list) => {
        const jobsSortedByCategories = {};
        for (const job of list) {
            if (!jobsSortedByCategories[job.department]) {
                jobsSortedByCategories[job.department] = [];
            }
            jobsSortedByCategories[job.department].push(job);
        }
        return jobsSortedByCategories;
    };
    const jobsSorted = sortJobsByCategory(jobs || []); // Handle possible undefined jobs
    return (_jsxs("div", { children: [_jsx("h2", { children: "Open Positions" }), (!jobs || jobs.length === 0) ? (_jsx("p", { children: "Sorry, no jobs available at this time" })) : (Object.entries(jobsSorted).map(([department, jobz]) => (_jsxs("div", { children: [_jsx("h3", { children: department }), jobz.map((j) => (_jsx(JobPost, { job: j }, j._id)))] }, department))))] }));
};
export default CareersScreen;
